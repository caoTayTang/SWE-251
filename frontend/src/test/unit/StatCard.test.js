import React from "react";
import { render, screen } from "@testing-library/react";
// 1. Sửa đường dẫn import (đi lùi 2 cấp, vào 'views')
import StatCard from "../../views/components/cards/StatCard";
import { Users } from "lucide-react";

describe("StatCard Component", () => {
  test("renders title, value, and icon correctly", () => {
    const mockIcon = <Users />;
    render(<StatCard title="Người dùng" value={345} icon={mockIcon} />);

    expect(screen.getByText("Người dùng")).toBeInTheDocument();
    expect(screen.getByText("345")).toBeInTheDocument();
  });
});
