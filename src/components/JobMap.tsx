import { useJobs } from '../hooks/useJobs';
import { Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { PoiMarkers } from './PoiMarkers';
import { JobInfoWindow } from '../models/JobInfoWindow';
import { calculateCenter } from '../utils/calculateCenter';
import { useEffect, useState } from 'react';
import { getJobLocation } from '../utils/jobUtils';

interface JobMapProps {
	jobId?: string;
}

export const JobMap = ({ jobId }: JobMapProps) => {
	const { jobs } = useJobs();
	const [jobLocations, setJobLocations] = useState<JobInfoWindow[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchJobLocations = async () => {
			setLoading(true);
			setError(null);

			let selectedJobs = jobs;

			if (jobId) {
				const job = jobs.find((j) => j.id === jobId);
				if (job) {
					selectedJobs = [job];
				} else {
					setError(`Job with ID ${jobId} not found.`);
					setLoading(false);
					return;
				}
			}
			try {
				const locations = await Promise.all(
					selectedJobs.map(async (job) => await getJobLocation(job))
				);

				const validLocations = locations.filter(
					(location): location is JobInfoWindow =>
						location !== null &&
						location.coordinates.lat !== 0 &&
						location.coordinates.lng !== 0
				);

				console.log('Valid Locations:', validLocations);

				setJobLocations(validLocations);
			} catch (err) {
				console.error('Error fetching job locations:', err);
				setError('Failed to fetch job locations.');
			} finally {
				setLoading(false);
			}
		};

		fetchJobLocations();
	}, [jobs, jobId]);

	const center = calculateCenter(jobLocations);

	return (
		<>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error}</div>}
			<Map
				style={{ width: 500, height: 500 }}
				defaultZoom={5}
				defaultCenter={center}
				mapId='b541ec0a861d850'
				onCameraChanged={(ev: MapCameraChangedEvent) =>
					console.log(
						'camera changed:',
						ev.detail.center,
						'zoom:',
						ev.detail.zoom
					)
				}
			>
				<PoiMarkers pois={jobLocations}></PoiMarkers>
			</Map>
		</>
	);
};
