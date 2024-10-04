import { useContext } from "react";
import { jobContext } from "../services/jobContext";
import { formatPublicationDate } from "../utils/dateUtils/formatPublicationDate";
import {
  DigiLayoutBlock,
  DigiLayoutContainer,
  DigiLink,
  DigiLoaderSpinner,
} from "@digi/arbetsformedlingen-react";
import {
  LayoutBlockContainer,
  LayoutBlockVariation,
  LinkVariation,
  LoaderSpinnerSize,
} from "@digi/arbetsformedlingen";
import "../styles/printAllJobb.css";
import { SearchHeader } from "./SearchHeader";

export const PrintAllJobs = () => {
  const context = useContext(jobContext);

  if (!context) return <p>Laddar...</p>;

  const { jobs, loading } = context;

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // show loader if loading is true
  if (loading) {
    return (
      <div className="spinner-container">
        <DigiLoaderSpinner
          afSize={LoaderSpinnerSize.LARGE}
          afText="Laddar"
        ></DigiLoaderSpinner>{" "}
      </div>
    );
  }

  return (
    <>
      <SearchHeader />
      <DigiLayoutContainer>
        <div className="job-list-container">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <DigiLayoutBlock
                key={job.id}
                afVariation={LayoutBlockVariation.PRIMARY}
                afContainer={LayoutBlockContainer.FLUID}
                afMarginBottom={false}
                className="digiLayoutBlock"
              >
                <div className="job-item-container">
                  {job.logo_url && (
                    <img src={job.logo_url} alt={`${job.employer.name} logo`} />
                  )}
                  <div>
                    <h3 className="job-title">
                      <DigiLink
                        afHref={`/#/annonser/${job.id}`}
                        onClick={scrollToTop}
                        afVariation={LinkVariation.SMALL}
                        aria-label={`Gå till annons för ${job.headline} hos ${job.employer.name} i ${job.workplace_address.municipality}`}
                      >
                        {job.headline}
                      </DigiLink>
                    </h3>

                    <h4>
                      {job.employer.name} - {job.workplace_address.municipality}
                    </h4>
                    <p className="job-occupation">{job.occupation.label}</p>
                    <p className="job-publication-date">
                      {formatPublicationDate(job.publication_date)}
                    </p>
                  </div>
                </div>
              </DigiLayoutBlock>
            ))
          ) : (
            <p>Inga jobb tillgängliga...</p>
          )}
        </div>
      </DigiLayoutContainer>
    </>
  );
};
