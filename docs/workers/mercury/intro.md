[Table of contents](../../readme.md) / [Workers](../intro.md)

# Mercury

*Mercury (/ˈmɜːrkjʊri/) is the patron god of financial gain, commerce, eloquence (and thus poetry), messages/communication (including divination), travelers, boundaries, luck, trickery and thieves*

Mercury is our reputation worker. This server reads off of our [Redis queue](../background-jobs.md) to increment and decrement reputation-related events that are triggered by users. The reputation system is how we can start to provide insights into the contributions of individual people back to the communities where they are members. 
