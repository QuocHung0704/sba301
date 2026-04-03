import { Pagination as BsPagination } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <BsPagination size="sm" className="mb-0">
      <BsPagination.Prev
        disabled={currentPage <= 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <BsPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BsPagination.Item>
      ))}
      <BsPagination.Next
        disabled={currentPage >= totalPages}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      />
    </BsPagination>
  );
}

export default Pagination;
