
export interface IPagination<T> {
  /*
    Pagination api 
    from request pageNo and limit will come 

    offset = (page -1) * limit
    const { count, rows } = findandCountAll();
    const totalPages = Math.ceil(count/limit)

  */

  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  [key:string]: T[] | number;
}

export interface IPage{
  offset: number;
  limit: number;
}
