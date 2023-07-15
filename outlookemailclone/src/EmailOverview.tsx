import { SyntheticEvent } from "react";
import { MailDetailsAndStatus } from "./App";
import MiniEmailDisplayCard from "./MiniEmailDisplayCard";
import LandingPageSuspense from "./SuspenseBlink";
import SuspenseBlink from "./SuspenseBlink";

interface Props {
    currentFilter: number,
    currentPageEmails: Array<MailDetailsAndStatus>,
    activeEmail: number,
    setActiveEmail: Function,
    markAsReadMain: Function
}
function EmailOverview({ currentFilter, currentPageEmails, activeEmail, setActiveEmail, markAsReadMain }: Props) {
    const markings: Array<string> = ["unread emails","read emails","favorite emails"]
    const markAsRead: Function = (miniEmailCardID: string, mainID: string) => {
        const index: number = parseInt(miniEmailCardID.split('-')[1]);
        markAsReadMain(index, mainID);
    }
    document.title = `INBOX - ${markings[currentFilter]}`;
    if(currentPageEmails.length==0){
        return (
            <div className="">
                Nothing to display here !! You have no {markings[currentFilter]}
            </div>
        )
    }
    return (
        <div className="emailListMini">
            {
                currentPageEmails.map((email: MailDetailsAndStatus, index: number) => {
                    let currentID: string = `miniEmail-${index}`;
                    let cardKey: string = `emailCard-${index}-${Math.floor(Math.random() * (100000 - 1 + 1)) + 1}`;
                    return(
                        <div key={cardKey}>
                             <MiniEmailDisplayCard miniEmailContents={email} activeEmail={activeEmail} miniEmailCardID={currentID} markAsRead={markAsRead} />
                        </div>
                    ) 
                })
            }
        </div>
    )
}
export default EmailOverview;