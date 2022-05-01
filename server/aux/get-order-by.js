const getOrderBy =  sort => {
  if(!sort) return null

  let mode = 'ASC'
  let field = null
  if(sort.startsWith('+') || sort.startsWith('-')) {
    mode = sort.startsWith('+') ? 'ASC' : 'DESC'
    field = sort.substr(1)
  } else {
    field = sort
  }
  return [field, mode]
}

module.exports = getOrderBy;
