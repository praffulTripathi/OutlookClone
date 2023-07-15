import React, { useEffect, useState } from 'react';
import EmailOverview from './EmailOverview';
import EmailBody from './EmailBody';
import FilterListOptions from './FilterListOptions';
import PageCount from './PageCount';
import './filterStyles.css'
import './emailBody.css'
import './emailOverview.css'
import LandingPageSuspense from './LandingPageSuspense';

export interface MiniEmailObject {
  id: string;
  from: {
    email: string;
    name: string;
  };
  date: number;
  subject: string;
  short_description: string;
}
interface LocalStorageKeyValue {
  favoriteEmail: MiniEmailObject
}
export interface MailDetailsAndStatus {
  miniEmail: MiniEmailObject,
  dateTime: string,
  status: string,
  isFav: boolean
}

export function getKeyValue(object: any, key: string): any {
  if (object === undefined)
    return undefined;
  if (object.hasOwnProperty(key))
    return object[key];
  else return undefined;
}

function App() {
  // States
  const [totalPages, setTotalPages] = useState<number>(-1);
  const [allEmailCount, setAllEmailCount] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentPageUrl = `https://flipkart-email-mock.vercel.app/?page=${currentPage}`;
  const [currentFilter, setCurrentFilter] = useState<number>(0);
  const [activeEmailIndex, setActiveEmailIndex] = useState<number>(-1);
  const [activeEmailID, setActiveEmailID] = useState<number>(-1);
  const [currentPageEmails, setCurrentPageEmails] = useState<Array<MailDetailsAndStatus>>([]);
  const [readMails, setReadMails] = useState<Array<MailDetailsAndStatus>>([]);
  const [wereInitialReads, setIfInitialReads] = useState<boolean>(false);
  const [readIDs, setReadIDs] = useState<Set<string>>(new Set());
  const [favoriteEmails, setFavoriteEmails] = useState<Array<MailDetailsAndStatus>>([]);
  const [wereInitialFavs, setIfInitialFavs] = useState<boolean>(false);
  const [favoriteIDs, setFavoriteIDs] = useState<Set<string>>(new Set());

  const transformDateTime: Function = (timeStamp: number) => {
    const date = new Date(timeStamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDateTime = `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    return formattedDateTime;
  }

  const updatePage: Function = (index: number) => {
    setCurrentPage(index);
  }

  const updateFilter: Function = (filterValue: number) => {
    setCurrentFilter(filterValue);
    setActiveEmailIndex(-1);
    if (filterValue === 0)
      setTotalPages(Math.ceil(allEmailCount / 10));
    if (filterValue === 1)
      setTotalPages(Math.ceil(readMails.length / 10));
    else if (filterValue === 2)
      setTotalPages(Math.ceil(favoriteEmails.length / 10));
  }

  const addNewFavorite: Function = (id: number) => {
    if (!currentPageEmails[id].isFav) {
      setCurrentPageEmails(currentPageEmails => {
        let updateEmailStatus: MailDetailsAndStatus = currentPageEmails[id];
        updateEmailStatus.isFav = true;
        currentPageEmails[id] = updateEmailStatus;
        return currentPageEmails;
      });
      setFavoriteEmails(favoriteEmails => [...favoriteEmails, currentPageEmails[id]]);
      setFavoriteIDs(favoriteIDs => {
        favoriteIDs.add(currentPageEmails[id].miniEmail.id);
        return favoriteIDs;
      })
    }
  }

  const removeFavorite: Function = (id: number) => {
    if (currentPageEmails[id].isFav) {
      setCurrentPageEmails(currentPageEmails => {
        let updateEmailStatus: MailDetailsAndStatus = currentPageEmails[id];
        updateEmailStatus.isFav = false;
        currentPageEmails[id] = updateEmailStatus;
        return currentPageEmails;
      });
      setFavoriteEmails(favoriteEmails => {
        const newList: Array<MailDetailsAndStatus> = [];
        favoriteEmails.map(favorite => {
          if (parseInt(favorite.miniEmail.id!) == id) {
            newList.push(favorite);
          }
        })
        return newList;
      });
      setFavoriteIDs(favoriteIDs => {
        favoriteIDs.delete(currentPageEmails[id].miniEmail.id);
        return favoriteIDs;
      })
    }
  }


  const markAsReadMain: Function = (id: number, mainID: number) => {
    if (currentPageEmails[id].status != "read") {
      let updateEmailStatus: MailDetailsAndStatus = currentPageEmails[id];
      updateEmailStatus.status = "read";
      setCurrentPageEmails(currentPageEmails => {
        currentPageEmails[id].status = "read";
        return currentPageEmails;
      });
      setReadMails(readMails => [...readMails, updateEmailStatus]);
      setFavoriteIDs(favoriteIDs => {
        favoriteIDs.add(currentPageEmails[id].miniEmail.id);
        return favoriteIDs;
      })
    }
    setActiveEmailIndex(id);
    setActiveEmailID(mainID);
  }

  const isEmailFavorite: Function = (emailID: string) => {
    if (favoriteIDs.has(emailID))
      return true;
    return false;
  }
  const isEmailRead: Function = (emailID: string) => {
    if (readIDs.has(emailID))
      return true;
    return false;
  }


  const fetchDefaultPageEmail: Function = async (url: string) => {
    await fetch(url)
      .then(response => response.json())
      .then(
        response => {
          setCurrentPageEmails([]);
          const totalEmailInList: number = getKeyValue(response, "total");
          const list: Array<MiniEmailObject> = getKeyValue(response, "list");
          list.map(newEmail => {
            const currDateTime: number = getKeyValue(newEmail, "date");
            const emailID: string = getKeyValue(newEmail, "id");
            const verifyIfFavorite: boolean = isEmailFavorite(emailID);
            const emailReadStatus: string = isEmailRead(emailID) ? "read" : "unread";
            const newMail: MailDetailsAndStatus = {
              miniEmail: newEmail,
              dateTime: transformDateTime(currDateTime),
              status: emailReadStatus,
              isFav: verifyIfFavorite
            };
            setCurrentPageEmails(currentPageEmails => [...currentPageEmails, newMail]);
          })
          if (totalPages == -1) {
            let countAllEmails: number = list.length;
            setAllEmailCount(totalEmailInList);
            if (countAllEmails === totalEmailInList)
              setTotalPages(1);
            else {
              let numPages: number = Math.ceil(totalEmailInList / countAllEmails);
              setTotalPages(numPages);
            }
          }
        }
      )
  }

  useEffect(() => {
    fetchDefaultPageEmail(currentPageUrl);
    const storedFavs: string | null = localStorage.getItem('favoriteEmails');
    const storedReads: string | null = localStorage.getItem('readEmails');
    if (storedFavs) {
      const parsedFavorites: Array<MailDetailsAndStatus> = JSON.parse(storedFavs);
      let len: boolean = false;
      if (parsedFavorites.length > 0) {
        len = true;
        setFavoriteEmails(parsedFavorites);
        parsedFavorites.map(favorite => {
          setFavoriteIDs(favoriteIDs => {
            favoriteIDs.add(favorite.miniEmail.id);
            return favoriteIDs;
          })
        })
      }
      setIfInitialFavs(len);
    }
    if (storedReads) {
      const parsedReads: Array<MailDetailsAndStatus> = JSON.parse(storedReads);
      let len: boolean = false;
      if (parsedReads.length > 0) {
        len = true;
        setReadMails(parsedReads);
        parsedReads.map(read => {
          setReadIDs(readIDs => {
            readIDs.add(read.miniEmail.id);
            return readIDs;
          })
        })
      }
      setIfInitialReads(len);
    }
  }, []);

  useEffect(() => {
    if (wereInitialFavs || favoriteEmails.length > 0) {
      localStorage.setItem('favoriteEmails', JSON.stringify(favoriteEmails));
    }
  }, [favoriteEmails]);

  useEffect(() => {
    if (wereInitialReads || readMails.length > 0) {
      localStorage.setItem('readEmails', JSON.stringify(readMails));
      const storedData = localStorage.getItem('readEmails');
    }
  }, [readMails]);

  useEffect(() => {
    fetchDefaultPageEmail(currentPageUrl);
  }, [currentPage]);

  if (currentPageEmails.length === 0) {
    return <LandingPageSuspense />
  }

  return (
    <div className="emailApp">
      <div className="emailAppBody">
        <div className="emailFilters">
          <span>Filter By:</span>
          <FilterListOptions currentFilter={currentFilter} updateFilter={updateFilter} />
        </div>
        <div className={activeEmailIndex === -1 ? "emailListAndBody" : "emailListAndBody flexEmailAndBody"}>
          <div className={activeEmailIndex === -1 ? "emailClient fullWidth" : "emailClient reduced"}>
            {
              currentFilter === 0 ?
                <EmailOverview currentFilter={currentFilter} currentPageEmails={currentPageEmails} activeEmail={activeEmailIndex} setActiveEmail={setActiveEmailIndex} markAsReadMain={markAsReadMain} />
                : currentFilter === 1 ?
                  <EmailOverview currentFilter={currentFilter} currentPageEmails={readMails} activeEmail={activeEmailIndex} setActiveEmail={setActiveEmailIndex} markAsReadMain={markAsReadMain} /> :
                  currentFilter === 2 ?
                    <EmailOverview currentFilter={currentFilter} currentPageEmails={favoriteEmails} activeEmail={activeEmailIndex} setActiveEmail={setActiveEmailIndex} markAsReadMain={markAsReadMain} /> :
                    null
            }
          </div>
          {
            activeEmailIndex === -1 ?
              null :
              <EmailBody activeEmail={activeEmailID} activeEmailIndex={activeEmailIndex} emailMiniDetails={currentPageEmails[activeEmailIndex]} addNewFavorite={addNewFavorite} removeOldFavorite={removeFavorite} />
          }
        </div>
        {
          totalPages === 0 ? null :
            <div className="pageNumbers">
              <PageCount totalPages={totalPages} currentPage={currentPage} updatePage={updatePage} />
            </div>
        }
      </div>
    </div>
  );
}

export default App;
