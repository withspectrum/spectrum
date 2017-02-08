export const hashToArray = (hash) => {
  let array = []
  for (let key in hash) {
    if (!hash.hasOwnProperty(key)) continue;
    let arr = hash[key];
    array.push(arr)
  }
  return array
}

export const sortAndGroupBubbles = (messages) => {
	let masterArray = []
	let newArray = []
	if (messages.length > 0) {
		let checkId
		
		for (let i = 0; i < messages.length; i++){
			if (i === 0) { checkId = messages[i].userId }

			if (messages[i].userId === checkId) {
				// this message user id does match
				newArray.push(messages[i])
				checkId = messages[i].userId
			} 
			else {
				// this message user id doesn't match
				masterArray.push(newArray)

				// reset
				checkId = messages[i].userId
				newArray = []
				newArray.push(messages[i])
			}


		}
	}
	masterArray.push(newArray)
	return masterArray
}

export default {
	hashToArray,
	sortAndGroupBubbles
}
