import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include page 1
      pageNumbers.push(1);
      
      // Calculate start and end pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis1');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis2');
      }
      
      // Always include the last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className={`select-none ${currentPage <= 1 || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
          />
        </PaginationItem>
        
        {getPageNumbers().map((pageNum, index) => (
          <PaginationItem key={`page-${pageNum}-${index}`}>
            {pageNum === 'ellipsis1' || pageNum === 'ellipsis2' ? (
              <span className="flex h-10 w-10 items-center justify-center select-none">...</span>
            ) : (
              <PaginationLink
                disabled={isLoading}
                isActive={currentPage === pageNum}
                onClick={() => onPageChange(pageNum)}
                className="cursor-pointer select-none"
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className={`select-none ${currentPage >= totalPages || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination; 