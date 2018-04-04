[Table of contents](../../readme.md) / [Workers](../intro.md)

# Vulcan

*Vulcan is the god of fire, including the fire of volcanoes, metalworking, and the forge.*

Vulcan is our search-indexing worker. Its job is to keep our data indexed properly on our search provider, [Algolia](https://www.algolia.com/). It does this by using RethinkDB's [changefeeds](https://rethinkdb.com/docs/changefeeds/javascript/) feature to listen for new documents, changed documents, and deleted documents in our database to signal that a new index event needs to occur.