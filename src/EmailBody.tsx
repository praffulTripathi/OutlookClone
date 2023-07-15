import { SyntheticEvent, useEffect, useState } from "react";
import { MailDetailsAndStatus, getKeyValue } from "./App";
import LandingPageSuspense from "./SuspenseBlink";
import SuspenseBlink from "./SuspenseBlink";

interface Props {
    activeEmail: number,
    activeEmailIndex: number,
    emailMiniDetails: MailDetailsAndStatus,
    addNewFavorite: Function,
    removeOldFavorite: Function
}
function EmailBody({ activeEmail, activeEmailIndex, emailMiniDetails, addNewFavorite, removeOldFavorite }: Props) {
    const getEmailBodyByID: string = `https://flipkart-email-mock.vercel.app/?id=${activeEmail}`;
    const [emailBody, setEmailBody] = useState<string>('');
    const fetchDefaultPageEmail: Function = async (url: string) => {
        await fetch(url)
            .then(response => response.json())
            .then(
                response => {
                    const emailBody: string = getKeyValue(response, "body");
                    setEmailBody(emailBody);
                }
            )
    }
    useEffect(() => { fetchDefaultPageEmail(getEmailBodyByID) }, [getEmailBodyByID])

    const markEmailAsFavorite: Function = (event: SyntheticEvent, miniEmailID: string) => {
        addNewFavorite(miniEmailID);
    }

    const removeFavorite: Function = (event: SyntheticEvent, miniEmailID: string) => {
        removeOldFavorite(miniEmailID);
    }
    if (emailBody === '')
        return (<SuspenseBlink />)
    return (
        <div className="emailBody">
            <div className="userLogoOuter extraMargin">
                <div className="userLogo">
                    {emailMiniDetails.miniEmail.from.name.charAt(0).toUpperCase()}
                </div>
            </div>
            <div className="emailSubjectBody">
                <div className="headings">
                    <div className="headingNFavorite">
                        <h2 className="emailSubject">{emailMiniDetails.miniEmail.subject}</h2>
                        {
                            emailMiniDetails.isFav ?
                                <button className="removeFavorite" onClick={(event) => removeFavorite(event, activeEmailIndex)}>Remove Favorite</button> :

                                <button className="markAsFavorite" onClick={(event) => markEmailAsFavorite(event, activeEmailIndex)}>Mark as favorite</button>

                        }
                    </div>
                    <span className="datetime">
                        {emailMiniDetails.dateTime}
                    </span>
                </div>
                <div className="emailDescription" dangerouslySetInnerHTML={{ __html: emailBody }} />
            </div>
        </div>
    )
}
export default EmailBody;