import {
  DigiLayoutBlock,
  DigiLayoutColumns,
  DigiInfoCard,
  DigiLinkExternal,
} from "@digi/arbetsformedlingen-react";
import { IJob } from "../models/IJob";
import {
  LayoutBlockVariation,
  LayoutBlockContainer,
  LayoutColumnsElement,
  LayoutColumnsVariation,
  InfoCardHeadingLevel,
  InfoCardType,
  InfoCardVariation,
  LinkVariation,
} from "@digi/arbetsformedlingen";
import ScreenSizeContext from "../contexts/ScreenSizeContext";
import { useContext } from "react";
import {
  formatDate,
  calculateDaysLeftToDeadline,
} from "../services/baseService";
import { formatPublicationDate } from "../utils/dateUtils/formatPublicationDate";
import ApplyNowInfo from "./ApplyNowInfo";
import QualificationsWindow from "./QualificationsWindow";
import LogoComponent from "./LogoComponent";
export interface IShowJobProps {
  job: IJob;
}

const ShowJob = ({ job }: IShowJobProps) => {
  const { municipality, street_address, postcode, city, region } =
    job.workplace_address || {};
  const context = useContext(ScreenSizeContext);
  const daysLeft = calculateDaysLeftToDeadline(job.application_deadline);

  if (!context) {
    throw new Error("SomeComponent must be used within a ScreenSizeProvider");
  }
  const { isDesktop } = context;

  const renderJobDetails = () => (
    <>
      <DigiLayoutBlock
        afVariation={LayoutBlockVariation.PRIMARY}
        afContainer={LayoutBlockContainer.STATIC}
        className="job-container"
      >
        <LogoComponent job={job} />
        <h1>{job.headline}</h1>
        <h2>{job.employer.name}</h2>
        <h3>{job.occupation.label}</h3>
        <h3>Kommun: {municipality ? municipality : "Ospecifierad ort"}</h3>
        <QualificationsWindow job={job} />
        <h2>Om jobbet</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: job.description.text_formatted,
          }}
        />
        <h2>Om Anställningen</h2>
        <h3>Lön</h3>
        <p>
          <strong>{job.salary_description}</strong>
        </p>
        <p>
          <strong>Lönetyp:</strong> {job.salary_type.label}
        </p>
        <h2>Var ligger arbetsplatsen?</h2>
        <h3>Postadress</h3>
        {street_address && postcode && city ? (
          <address>
            <div>{street_address}</div>
            <div>
              {postcode} {city}
            </div>
          </address>
        ) : (
          <p>
            Arbetsplatsen ligger i kommunen <strong>{municipality}</strong> i{" "}
            <strong>{region}</strong>.
          </p>
        )}
        <h2>Om arbetsgivaren</h2>
        <p>{job.employer.name}</p>
        <h2>Kontakt</h2>
        {job.employer.workplace} <br />
        {job.employer.url && (
          <DigiLinkExternal
            afHref={job.employer.url}
            afTarget="_blank"
            afVariation={LinkVariation.SMALL}
          >
            {job.employer.url}
          </DigiLinkExternal>
        )}
        <p>{job.employer.email}</p>
        <p>{job.employer.phone_number}</p>
      </DigiLayoutBlock>

      <DigiLayoutBlock
        afVariation={LayoutBlockVariation.PRIMARY}
        afContainer={LayoutBlockContainer.STATIC}
        className="map-container"
      >
        <h2>En karta här</h2>
        <DigiInfoCard
          afHeading="Sök jobbet"
          afHeadingLevel={InfoCardHeadingLevel.H2}
          afType={InfoCardType.RELATED}
          afVariation={InfoCardVariation.SECONDARY}
        >
          <strong>
            <h3>Ansök senast: {formatDate(job.application_deadline)}</h3>
          </strong>
          {daysLeft > 0 ? (
            <p>
              <em>Ansökningstiden går ut om {daysLeft} dagar</em>
            </p>
          ) : (
            <p>
              <em>Ansökningstiden har gått ut</em>
            </p>
          )}

          <ApplyNowInfo job={job} />

          <span>
            {formatPublicationDate(job.publication_date)}
            {". "}
          </span>
          <span>Annons-Id: {job.id}</span>
        </DigiInfoCard>
      </DigiLayoutBlock>
    </>
  );

  return (
    <>
      <DigiLayoutBlock
        afVariation={LayoutBlockVariation.PRIMARY}
        afContainer={LayoutBlockContainer.STATIC}
      >
        {isDesktop ? (
          <DigiLayoutColumns
            afElement={LayoutColumnsElement.DIV}
            afVariation={LayoutColumnsVariation.THREE}
          >
            {renderJobDetails()}
          </DigiLayoutColumns>
        ) : (
          <DigiLayoutBlock>{renderJobDetails()}</DigiLayoutBlock>
        )}
      </DigiLayoutBlock>
    </>
  );
};

export default ShowJob;
