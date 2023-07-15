interface Props{
    totalPages: number,
    currentPage: number,
    updatePage: Function
}
function PageCount({totalPages,currentPage,updatePage}:Props){
    const pages:Array<number> = [];
    for(let i=1;i<=totalPages;i++){
        pages.push(i);
    }
    const reducedArray:Array<number> = pages.slice(0,10);
    const changePage:Function = (index:number) => {
        updatePage(index);
    }

    return (
    <div className="pageNumber">
        <span>Page:</span>
        <ul className="pages">
            {
                    reducedArray.map((page,index)=>{
                    return index===10?
                    <li key={`page-${index}`} className="currentPage">Next 10 Pages</li>:
                    index===currentPage-1?
                    <li key={`page-${index}`} className="currentPage bkgColor" onClick={(event)=>{changePage(index+1)}}>{page}</li>:
                    <li key={`page-${index}`} className="currentPage" onClick={(event)=>{changePage(index+1)}}>{page}</li>
                })
            }
        </ul>
    </div>)
}
export default PageCount;