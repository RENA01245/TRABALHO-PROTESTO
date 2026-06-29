import { ReactNode } from "react";

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
