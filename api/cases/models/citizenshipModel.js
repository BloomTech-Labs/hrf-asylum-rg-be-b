const db = require('../../../data/db-config');

/*
    Building citizenshipResults
*/

/*
    1. Total cases by citizenship and outcome
*/

const totalCasesByCitizenshipAndOutcome = async (citizenship, outcome) => {
  return await db('cases')
    .where({ case_outcome: outcome, citizenship: citizenship })
    .count('id');
};

/*
    2. Total cases by citizenship
*/

const totalCasesByCitizenship = async (citizenship) => {
  return await db('cases').where({ citizenship: citizenship }).count('id');
};

/*
    3. Percent cases by citizenship and outcome
*/

const percentCasesByCitizenshipAndOutcome = async (citizenship, outcome) => {
  const numCases = await totalCasesByCitizenship(citizenship);
  const numCasesByOutcome = await totalCasesByCitizenshipAndOutcome(
    citizenship,
    outcome
  );
  return numCasesByOutcome[0].count / numCases[0].count;
};

/*
    4. Citizenship results object
*/

const citizenshipResultsObj = async (citizenship) => {
  const percentGranted = await percentCasesByCitizenshipAndOutcome(
    citizenship,
    'Grant'
  );
  const totalGranted = await totalCasesByCitizenshipAndOutcome(
    citizenship,
    'Grant'
  );
  const totalDenied = await totalCasesByCitizenshipAndOutcome(
    citizenship,
    'Deny/Referral'
  );
  const totalAdminClosed = await totalCasesByCitizenshipAndOutcome(
    citizenship,
    'Admin Close/Dismissal'
  );
  const totalAsylumTerminated = await totalCasesByCitizenshipAndOutcome(
    citizenship,
    'Asylum Terminated'
  );
  const totalClosedNacaraGrant = await totalCasesByCitizenshipAndOutcome(
    citizenship,
    'Admin Close - NACARA Grant'
  );
  return {
    citizenship: citizenship,
    granted: percentGranted,
    totalGranted: parseInt(totalGranted[0].count),
    denied: parseInt(totalDenied[0].count),
    adminClosed: parseInt(totalAdminClosed[0].count),
    asylumTerminated: parseInt(totalAsylumTerminated[0].count),
    closedNacaraGrant: parseInt(totalClosedNacaraGrant[0].count),
  };
};

/*
    5. Distinct citizenships
*/

const distinctCitizenships = async () => {
  return await db('cases').distinct('citizenship').select('citizenship');
};

/*
    6. Citizenship results
*/

const citizenshipSummary = async () => {
  const citizenships = await distinctCitizenships();
  const results = [];
  for (let i = 0; i < citizenships.length; i++) {
    const result = await citizenshipResultsObj(citizenships[i].citizenship);
    results.push(result);
  }
  return results;
};

module.exports = {
  citizenshipResultsObj,
  citizenshipSummary,
  distinctCitizenships,
  percentCasesByCitizenshipAndOutcome,
  totalCasesByCitizenship,
};
