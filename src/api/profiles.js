import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';
import id from 'date-fns/esm/locale/id';

/**
 * POST
 */
const POST_NEW_PROFILE = `${config.apiStorage}/storage-service/user-link`;

/**
 * GET
 */
const GET_PROFILE_BY_ID = `${config.apiStorage}/storage-service/user-link`;
const GET_PROFILE_DATA = `${config.apiStorage}/storage-service/user-link/search/paged`;

/**
 * DELETE
 */
const DELETE_USER_PROFILE = `${config.apiStorage}/storage-service/user-link`;

/**
 * FUNCTIONS
 */

export async function getProfileDataByID(id) {
    const policy = await makeApiCall(`${GET_PROFILE_BY_ID}/${id}`, 'GET');

    return policy.data;
}

export async function getProfileData(page, size, sort, name) {
    const filterBody = { likeFirstName: name, likeLastName: name };
    const sortColumn = sort.column == 'profileName'
        ? 'firstName'
        : sort.column == 'profileCompany'
            ? 'company'
            : sort.column == 'profileInternalPerson'
                ? 'isInternal'
                : sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=dateCreated,DESC';

    return await makeApiCall(`${GET_PROFILE_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

export async function postNewProfile(requestBody) {
    return await makeApiCall(POST_NEW_PROFILE, 'POST', requestBody);
}

const UPDATE_PROFILE = `${config.apiStorage}/storage-service/user-link`;

export async function updateProfile(data: Object) {
    return await makeApiCall(UPDATE_PROFILE, 'PUT', data);
}

export async function deleteUserProfile(id) {
    return await makeApiCall(`${DELETE_USER_PROFILE}/${id}`, 'DELETE');
}
