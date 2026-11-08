// Short reason for a failed request, shown in the request alert.
//
// The DaaS backend puts its reason in `sys_log` (and exception details in
// `error_message`), the Java backend in `message` or, for the token endpoint,
// `error_description`. A DaaS error inside an HTTP 200 carries its own
// `response_code`.
const reasonOf = (data) => {
  if (!data || typeof data !== 'object') {
    return '';
  }
  return data.sys_log || data.error_message || data.error_description || data.message || '';
};

export const describeError = (error) => {
  const response = error?.response;
  if (!response) {
    return error?.message === 'Network Error' ? 'Backend not reachable' : error?.message || '';
  }
  const code = response.status === 200 ? response.data?.response_code : response.status;
  const reason = reasonOf(response.data);
  return reason ? `${reason} (${code})` : `Error ${code}`;
};

// Reason for a DaaS response that came back with an error code in its body.
export const describeResponse = (response) => describeError({ response });
