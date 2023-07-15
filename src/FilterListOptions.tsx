interface Props {
    currentFilter: number,
    updateFilter: Function
}
function FilterListOptions({ currentFilter, updateFilter }: Props) {
    const filterList = ["Unread", "Read", "Favorites"];
    const toggleActiveFilter: Function = (newFilterID: string) => {
        const getActiveFilter: HTMLElement | null = document.querySelector('.activeFilter');
        if (getActiveFilter?.id !== newFilterID) {
            getActiveFilter?.classList.toggle('activeFilter');
            const filterToSetActive: HTMLElement | null = document.getElementById(newFilterID);
            filterToSetActive?.classList.toggle('activeFilter');
        }
        updateFilter(parseInt(newFilterID.split('-')[1]));
    }
    return (
        <div className="filterListOuter">
            <ul className="filterList">
                {
                    filterList.map((filter, index) => {
                        return index === currentFilter ?
                            <li id={`filter-${index}`} key={`filter-${index}`} className="filter activeFilter" onClick={(event) => toggleActiveFilter(`filter-${index}`)}>{filter}</li>
                            :
                            <li id={`filter-${index}`} key={`filter-${index}`} className="filter" onClick={(event) => toggleActiveFilter(`filter-${index}`)}>{filter}</li>
                    })
                }
            </ul>
        </div>
    )
}
export default FilterListOptions;