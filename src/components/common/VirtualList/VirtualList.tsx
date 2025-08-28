import React from "react";
import { useVirtualization } from "@hooks/useVirtualization";

interface VirtualListProps<T extends { id: string }> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualList<T extends { id: string }>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = "",
}: VirtualListProps<T>) {
  const {
    scrollElementRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
  } = useVirtualization(items, { itemHeight, containerHeight });

  return (
    <div
      ref={scrollElementRef}
      onScroll={handleScroll}
      style={{ height: containerHeight }}
      className={`overflow-auto relative ${className}`}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={item.id} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
