# Build your own fetch!

`fetch` is global, and some packages enhance it.

However, should we really do this? A better choice might be to build your own fetch to do this explicitly, and keep window.fetch as it is.

This will make it 
- more easier to find the logic, `fetch` is just `fetch`, if I want to use my own fetch with interceptor, I need to import it and use.
- flexiable to add functions you need.

Request 
   |
   |    Request interceptor
   ↓
Request or Response, if a response, return it immediately with Promise.Resovle wrapped(only for mock, otherwise why do we need it? So the flaky Response does not go through response interceptor too.)
   |
   |    Request interceptor
   ↓
Final Request
   |
   |    NETWORK
   ↓
Response
   |
   |    Reponse interceptor
   ↓
 .....
   |
   |    Reponse interceptor
   ↓
Final Response