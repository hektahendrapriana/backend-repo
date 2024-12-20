/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
const handleError = (res: any = {}, err: any = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('err', err)
  }
  
  res.status(err.code).json({
    errors: {
      code: err.code,
      msg: err.message
    }
  })
}

export { handleError }
    