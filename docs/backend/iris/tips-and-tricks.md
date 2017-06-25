# Tips and Tricks

## Keep resolvers as small as possible

What we mean by this is that resolvers should (for the most part) only be a mapping between a certain path and the model function that takes care of it. Make sure the least amount of business logic possible lives in resolvers. (these are reminiscent of Controllers in a traditional MVC setup)

## Error management

We mask internal errors in production. (GraphQL schema errors are still visible of course) Instead of seeing "Database limit exceeded, please upgrade your account xyz.", the user only sees "Internal Error: asdf123-asdf-asdf-asdf1235" (where `"asdf123-asdf-asdf-asdf1235"` is the Sentry UUID that helps us reference that error to a stacktrace on Sentry) which means no sensitive information is leaked.

Sometimes you want to show the user an error though, for example for permissions. In that case you have to use the `UserError` util, which will not be masked:

```javascript
import UserError from '../utils/UserError';

// The user will see this full error message
throw new UserError('You do not have permission to access this!')
```
