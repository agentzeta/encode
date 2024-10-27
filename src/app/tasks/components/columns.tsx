"use client";

// import necessary components
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Button } from "@/registry/new-york/ui/button";

// Define columns with customized data fields for user positions
export const columns: any = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] hidden"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] hidden"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Address" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate">{row.getValue("userAddress")}</div>
    ),
  },
  {
    accessorKey: "healthFactor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Health Factor" />
    ),
    cell: ({ row }) => <div>{row.getValue("healthFactor")}</div>,
  },
  {
    accessorKey: "totalCollateralBase",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Collateral" />
    ),
    cell: ({ row }) => <div>{row.getValue("totalCollateralBase")}</div>,
  },
  {
    accessorKey: "totalDebtBase",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Debt" />
    ),
    cell: ({ row }) => <div>{row.getValue("totalDebtBase")}</div>,
  },
  {
    accessorKey: "liquidationThreshold",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Liquidation Threshold" />
    ),
    cell: ({ row }) => <div>{row.getValue("liquidationThreshold")}</div>,
  },
  {
    accessorKey: "display",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Collateral" />
    ),
    cell: ({ row }) => {
      const hf = row.getValue("healthFactor");
      if (hf <= 1.0) {
        return (
          <Button className="h-5 text-white dark:text-black">Liquidate</Button>
        );
      } else {
        return (
          <Button className="h-5 text-white dark:text-black">
            Cannot Liquidate
          </Button>
        );
      }
    },
  },
];
