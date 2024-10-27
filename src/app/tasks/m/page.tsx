"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";

// Initialize provider - use your own node or service
const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/6ee66c8460e0445b9e01bd338ff90f70"
);

// Aave V3 Pool contract address on mainnet
const AAVE_V3_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const AAVE_DATA_PROVIDER = "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3";

// Minimal ABI for Aave Pool
const AAVE_POOL_ABI = [
  "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  "function getReservesList() external view returns (address[])",
  "event LiquidationCall(address indexed collateralAsset, address indexed debtAsset, address indexed user, uint256 debtToCover, uint256 liquidatedCollateralAmount, address liquidator, bool receiveAToken)",
];

// Initialize contract interfaces
const aavePool = new ethers.Contract(AAVE_V3_POOL, AAVE_POOL_ABI, provider);

const LiquidablePositionsDashboard = () => {
  const [liquidablePositions, setLiquidablePositions] = useState([]);

  useEffect(() => {
    // Function to scan recent blocks
    async function scanRecentBlocks() {
      try {
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 1000000; // Look back 1000 blocks

        // Listen for liquidation events
        const liquidationFilter = aavePool.filters.LiquidationCall();
        const liquidationEvents = await aavePool.queryFilter(
          liquidationFilter,
          fromBlock,
          currentBlock
        );

        console.log(`Found ${liquidationEvents.length} recent liquidations`);

        // Analyze each liquidation
        for (const event of liquidationEvents) {
          const user = event.args.user;
          await checkUserHealth(user);
        }
      } catch (error) {
        console.error("Error scanning blocks:", error);
      }
    }

    async function checkUserHealth(userAddress) {
      try {
        const accountData = await aavePool.getUserAccountData(userAddress);

        // Convert health factor to readable number (1e18 decimals)
        const healthFactor = ethers.utils.formatUnits(accountData.healthFactor, 18);

        // Positions with health factor below 1.2 are getting risky
        if (parseFloat(healthFactor) < 1.2) {
          console.log(`\nRisky Position Found:`);
          console.log(`User Address: ${userAddress}`);
          console.log(`Health Factor: ${healthFactor}`);
          console.log(
            `Total Collateral (USD): ${ethers.utils.formatUnits(
              accountData.totalCollateralBase,
              8
            )}`
          );
          console.log(
            `Total Debt (USD): ${ethers.utils.formatUnits(
              accountData.totalDebtBase,
              8
            )}`
          );

          // Calculate liquidation price
          const liquidationThreshold =
            accountData.currentLiquidationThreshold.toString() / 10000;
          console.log(`Liquidation Threshold: ${liquidationThreshold}`);

          // Add to state for rendering in the UI
          setLiquidablePositions(prev => [
            ...prev,
            {
              userAddress,
              healthFactor,
              totalCollateralBase: ethers.utils.formatUnits(accountData.totalCollateralBase, 8),
              totalDebtBase: ethers.utils.formatUnits(accountData.totalDebtBase, 8),
              liquidationThreshold,
            }
          ]);
          console.log('base')
          console.log(liquidablePositions);
        }
      } catch (error) {
        console.error(`Error checking health for ${userAddress}:`, error);
      }
    }

    scanRecentBlocks();
  }, []);

  return (
    <div className="mt-32">
      <h1>Liquidable Positions Dashboard</h1>
      {liquidablePositions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User Address</th>
              <th>Health Factor</th>
              <th>Total Collateral (USD)</th>
              <th>Total Debt (USD)</th>
              <th>Liquidation Threshold</th>
            </tr>
          </thead>
          <tbody>
            {liquidablePositions.map((position, index) => (
              <tr key={index}>
                <td>{position.userAddress}</td>
                <td>{position.healthFactor}</td>
                <td>{position.totalCollateralBase}</td>
                <td>{position.totalDebtBase}</td>
                <td>{position.liquidationThreshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No liquidable positions found.</p>
      )}
    </div>
  );
};

export default LiquidablePositionsDashboard;
