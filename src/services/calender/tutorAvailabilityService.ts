import { executeSQLQuery } from "../../database";


export const getTutorAvailability = async (tutorId:any) => {
  const result = await executeSQLQuery('SELECT * FROM tutor_availability WHERE tutor_id = $1 AND status != $2', [tutorId, 'removed']);
  return result.rows;
};


export const addTutorAvailability = async (tutorId:any, availableDate:any) => {
  await executeSQLQuery(
    'INSERT INTO tutor_availability (tutor_id, available_date, status) VALUES ($1, $2, $3)',
    [tutorId, availableDate, 'booked']
  );
};


export const updateTutorAvailability = async (tutorId:any, availableDate:any, status:any) => {
  await executeSQLQuery(
    'UPDATE tutor_availability SET status = $1 WHERE tutor_id = $2 AND available_date = $3',
    [status, tutorId, availableDate]
  );
};


export const removeTutorAvailability = async (tutorId:any, availableDate:any) => {
  await executeSQLQuery(
    'DELETE FROM tutor_availability WHERE tutor_id = $1 AND available_date = $2',
    [tutorId, availableDate]
  );
};
