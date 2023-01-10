const express = require('express');
const Cases = require('./casesModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Case:
 *      type: object
 *      required:
 *        - id
 *        - affirmative case id
 *        - asylum office
 *        - citizenship
 *        - race or ethnicity
 *        - case outcome
 *        - completion date
 *        - data current as of
 *      properties:
 *        id:
 *          type: uuid
 *          description: This is a unique key for each case.
 *        affirmative case id:
 *          type: string
 *        asylum office:
 *          type: string
 *        citizenship:
 *          type: string
 *          description: This is the citizenship of the person who filed the case.
 *        race or ethnicity:
 *          type: string
 *          description: This is the race/ethnicity of the person who filed the case.
 *       case outcome:
 *          type: string
 *          description: This is the outcome of the case.
 *       completion date:
 *          type: datetime
 *          description: This is the date the case was completed.
 *      data current as of:
 *          type: datetime
 *          description: This is the date the data was current as of.
 *      example:
 *        id: '1001'
 *        affirmative case id: '(B)(6)'
 *        asylum ofice: 'ZLA'
 *        citizenship: 'Mexico'
 *        race or ethnicity: 'OTHER'
 *        case outcome: 'Grant'
 *        completion date: '1/1/22'
 *        data current as of: '2022-01-01'
 * /cases:
 *  get:
 *    description: Returns a list of cases
 *    summary: Get a list of all cases
 *    tags:
 *      - case
 *    responses:
 *      200:
 *        description: array of profiles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/cases'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', function (req, res) {
  Cases.findAll()
    .then((cases) => {
      res.status(200).json(cases);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    profileId:
 *      name: id
 *      in: path
 *      description: ID of the profile to return
 *      required: true
 *      example: 00uhjfrwdWAQvD8JV4x6
 *      schema:
 *        type: string
 *
 * /profile/{id}:
 *  get:
 *    description: Find profiles by ID
 *    summary: Returns a single profile
 *    security:
 *      - okta: []
 *    tags:
 *      - profile
 *    parameters:
 *      - $ref: '#/components/parameters/profileId'
 *    responses:
 *      200:
 *        description: A profile object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Profile'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'Profile not found'
 */
router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Cases.findById(id)
    .then((_case) => {
      if (profile) {
        res.status(200).json(_case);
      } else {
        res.status(404).json({ error: 'CaseNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
