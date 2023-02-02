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
    return await db('cases')
        .where({ citizenship: citizenship })
        .count('id');
};

/*
    3. Percent cases by citizenship and outcome
*/

const percentCasesByCitizenshipAndOutcome = async (citizenship, outcome) => {
    const numCases = await totalCasesByCitizenship(citizenship);
    const numCasesByOutcome = await totalCasesByCitizenshipAndOutcome(citizenship, outcome);
    return (numCasesByOutcome[0].count / numCases[0].count);
};

/*
    4. Citizenship results object
*/

const citizenshipResultsObj = async (citizenship) => {
    const percentGranted = await percentCasesByCitizenshipAndOutcome(citizenship, 'Grant');
    const percentDenied = await percentCasesByCitizenshipAndOutcome(citizenship, 'Deny/Referral');
    const percentAdminClosed = await percentCasesByCitizenshipAndOutcome(citizenship, 'Admin Close/Dismissal');
    const percentAsylumTerminated = await percentCasesByCitizenshipAndOutcome(citizenship, 'Asylum Terminated');
    const percentClosedNacaraGrant = await percentCasesByCitizenshipAndOutcome(citizenship, 'Admin Close - NACARA Grant');
    return {
        citizenship: citizenship,
        granted: percentGranted,
        denied: percentDenied,
        adminClosed: percentAdminClosed,
        asylumTerminated: percentAsylumTerminated,
        closedNacaraGrant: percentClosedNacaraGrant
    };
};

/*
    5. Distinct citizenships
*/

const distinctCitizenships = async () => {
    return await db('cases')
        .distinct('citizenship')
        .select('citizenship');
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