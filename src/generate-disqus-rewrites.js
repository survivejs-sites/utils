function generateDisqusRewrites(prefix, redirects) {
  let result = "";
  Object.keys(headers).forEach(k => {
    const v = headers[k];

    result += prefix + k + "/, " + prefix + v + ",\n";
  });

  return result;
}

export default generateDisqusRewrites;
