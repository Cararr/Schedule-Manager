import React, { useState, useEffect } from 'react';
import {
	getWorkStageSpans,
	getSchedulesByDate,
	generateSchedule,
	getHomeRehabilitationsByDate,
} from '../../util/fetchFromDB';
import { updateSchedule } from '../../util/postToDB';
import { deleteHomeRehabilitation } from '../../util/deleteFromDB';
import EmployeesList from '../EmployeesList/EmployeesList.jsx';
import Tables from '../Tables/Tables.jsx';
import TablesActionPanel from '../TablesActionPanel/TablesActionPanel.jsx';
import { Utilities } from '../../util/util';
import NavBar from '../NavBar/NavBar.jsx';
import { useUser } from '../../context/userContext';
import { genericWarning } from '../../WinBox/winboxMessages';
import './Schedule.css';

export default function Schedule() {
	const [currentlyDragged, setCurrentlyDragged] = useState('');
	const [dateSelected, setDateSelected] = useState(
		Utilities.formatDateString(new Date())
	);

	const [currentSchedule, setCurrentSchedule] = useState({
		schedules: null,
		homeRehabilitations: [],
	});

	const [homeRehabilitationsEdited, setHomeRehabilitationsEdited] = useState(
		[]
	);

	const removeHomeRehabilitation = async (homeRehabilitaitonId) => {
		if (await deleteHomeRehabilitation(homeRehabilitaitonId)) {
			setHomeRehabilitationsEdited((prev) =>
				prev.filter((hR) => hR !== homeRehabilitaitonId)
			);
			setCurrentSchedule((prev) => ({
				...prev,
				homeRehabilitations: prev.homeRehabilitations.filter(
					(hR) => hR.id !== homeRehabilitaitonId
				),
			}));
		} else genericWarning();
	};

	useEffect(() => {
		setAreChangesSaved(true);
		(async function () {
			const schedules = await getSchedulesByDate(dateSelected);
			const homeRehabilitations = await getHomeRehabilitationsByDate(
				dateSelected
			);
			setCurrentSchedule({ schedules, homeRehabilitations });
		})();
	}, [dateSelected]);

	const [workStageSpans, setworkStageSpans] = useState([]);
	useEffect(() => {
		getWorkStageSpans().then((stages) => setworkStageSpans(stages));
	}, []);

	const [areChangesSaved, setAreChangesSaved] = useState(true);
	const editSchedule = (cellNumber, stationName, newCellValue) => {
		setCurrentSchedule((prev) => {
			const updatedSchedule = { ...prev };
			if (stationName === 'homeRehabilitations') {
				updatedSchedule.homeRehabilitations[Number(cellNumber)].employee =
					newCellValue;
				setHomeRehabilitationsEdited((prev) => [...prev, Number(cellNumber)]);
			} else {
				if (areChangesSaved) setAreChangesSaved(false);
				updatedSchedule.schedules[stationName][Number(cellNumber)] =
					newCellValue;
			}
			return updatedSchedule;
		});
	};

	const saveScheudle = async () => {
		setAreChangesSaved(true);
		await updateSchedule(dateSelected, currentSchedule.schedules);
	};

	const autoGenerateSchedule = async () => {
		generateSchedule().then((schedules) => {
			setAreChangesSaved(false);
			setCurrentSchedule((prev) => (schedules ? { ...prev, schedules } : prev));
		});
	};

	const saveHomeRehabilitations = async () => {};

	const clearSchedule = () => {
		setAreChangesSaved(false);
		setCurrentSchedule((prev) => ({
			...prev,
			schedules: Utilities.returnEmptyDailyShiftObject(),
		}));
	};

	const isUserAdmin = Utilities.checkIfUserIsAdmin(useUser());

	return (
		<div>
			<NavBar />
			<div className="schedule">
				{isUserAdmin && <EmployeesList />}
				<Tables
					currentlyDragged={currentlyDragged}
					setCurrentlyDragged={setCurrentlyDragged}
					dateSelected={dateSelected}
					setDateSelected={setDateSelected}
					currentSchedule={currentSchedule}
					editSchedule={editSchedule}
					workStageSpans={workStageSpans}
					homeRehabilitationsEdited={homeRehabilitationsEdited}
					removeHomeRehabilitation={removeHomeRehabilitation}
				/>
				{isUserAdmin && (
					<TablesActionPanel
						areChangesSaved={areChangesSaved}
						saveScheudle={saveScheudle}
						autoGenerateSchedule={autoGenerateSchedule}
						clearSchedule={clearSchedule}
					/>
				)}
			</div>
		</div>
	);
}
