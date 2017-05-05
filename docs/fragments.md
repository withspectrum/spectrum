_Labeling this as a discussion issue mostly because I'm still learning about graphql and fragments and all that myself, so this is all totally fair game for changing._

I wanted to quickly note how I've been using Fragments in my queries and why they are useful for us as we all start writing our own bits of the app.

### Structure
![screenshot 2017-05-02 17 06 31](https://cloud.githubusercontent.com/assets/1923260/25644273/b6ac5daa-2f59-11e7-916d-2f985fff6237.png)

The reason these fragments are so obnoxiously granular is because there are times when you might have circular fragment requirements, which don't play well with webpack at the moment. For example, a user might require a story, which might require a user. So the files are importing each other and it breaks.

To solve this I've made super granular fragments in individual files. I've found it's somewhat useful from a naming convention point of view, and makes it super clear when importing files and actually using the fragments in a query.

### Why fragments?
Fragments help us to always know exactly what kind of data will be returned for a given query and ensure that we are consistent in what data should be returned to any given component.

Imagine we wrote two queries like this:

```
# query 1
user {
  uid
  displayName
}

# query 2
user {
  uid
  username
}
```

If these queries get implemented in different places, for different components, we're going to end up with a confusing mess where we never really know what information we have access to when writing our react components. We might accidentally write `{user.username}` expecting that data to exist, but alas we wrote the featuring using query 1. Oops.

### Current implementation
To avoid the problems above, I've broken out common bits of data into fragments that we should be using as often as possible when composing our queries. Here's an example:

```js
import { gql } from 'react-apollo';

export const userInfoFragment = gql`
  fragment userInfo on User {
    uid
    photoURL
    displayName
    username
  }
`;
```

And here's how that would look in a query file:
```js
const getUser = gql`
  query getUser($username: String, $after: String) {
    user(username: $username) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;
```

By using this fragment, we can always ensure we're getting back the data we need and start to build up an internal mental model of what data we have access to regardless of where we're working in the app.

This is especially useful for when we want to handle some pagination logic. We can just use a fragment to both a) save ourselves the hassle of writing a big query and 2) ensure we haven't forgotten a key field (like `cursor`) during implementation. Like this:

```js
export const userCommunitiesFragment = gql`
  fragment userCommunities on User {
    communityConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...communityInfo
        }
      }
    }
  }
  ${communityInfoFragment}
`;
```

Notice there that we're using a sub-fragment to get the `communityInfo`, too!

That looks like:

```js
export const communityInfoFragment = gql`
  fragment communityInfo on Community {
    id
    name
    slug
  }
`;
```

And now we've saved ourselves time, and ensured that we will always have access to critical data about the communities, even if we are writing a query against the user.

### Final notes
Fragments make it tempting to create really deep queries, but that's a bad idea for performance reasons. Therefore, fragments themselves should be as shallow as possible to combat this, ideally never going more than a couple levels of data deep.

When writing the fragments + queries, I tried to think to myself:
***If I were using this fragment, what data would I absolutely expect to be returned?***

For example, the `storyInfo` fragment looks like:
```js
import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const storyInfoFragment = gql`
  fragment storyInfo on Story {
    id
    messageCount
    createdAt
    modifiedAt
    published
    deleted
    locked
    content {
      title
      description
    }
    author {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;
```

I included the `author` and `...userInfo` fragment on `storyInfo` because I can't think of a single use case we have where we'd want to show a story *without* the author info. However, note that I didn't include any information about the frequency this story was posted under. That's because if I'm *viewing that frequency* it would be a massively underperforming query to also include frequency data with *each story*.

So instead, if I *do* need the frequency data for a story, I add that at the query layer:

```js
const getStory = gql`
  query getStory($id: String) {
    ...storyInfo
    frequency {
      ...frequencyInfo
    }
  }
  ${userInfoFragment}
  ${frequencyInfoFragment}
`;
```

### Thoughts?
Totally open for suggestions and thoughts. All working examples are already merged into `v2` branch if you want to poke around.
