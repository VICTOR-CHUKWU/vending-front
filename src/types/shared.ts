export interface InlineErrProps {
    err?: any;
  }
  
  export interface INavMenus {
    name: string;
    url: string;
  }

  export interface TPagination {
    perPage: number;
    currentPage: number;
    totalPages: number;
    totalDocumentCount: number;
    paginationURI: string;
  }