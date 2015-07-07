# djsom
A data javascript object manager

Most databases use a data store that data is pushed and pulled from.

These days many applications have heavy load and latency requirements, and data caching is becoming very popular as being the fastest solution.  And NoSQL to eliminate parsing over heads.  Still most stay close to traditional data concepts and why not tradition is good and it helps us be smarter (most of the time)

Ok we on of the problems with traditional data design is that it is second second hand and you can always have doubt as to whether it is actually current or has been modified before or at the same time.  If your application's server is on a different machine then this is unavoidable.  But if you are will to put your application server and data server in the same bucket, then you have a rather outdated and for some reasons concept of a javascript object.  Caching is storing data in memory, I js object is also stored in memory, what the freak is the difference?  When maybe constraints?  but most caching through out constraints.  Persistance?  Again most caching deals with persistance by "backing up" th data either when it changes, on session start and end or on regular intervals.

It begs the question why not just use a javascript object for all your data needs?  There are lots of good reason not to, but just as many requirements that will likely push you back to the beginning of keeping everything inside the server and in memory.  So why build a freaking complete solution for something the forces itself to be simple.  Use a freaking javascript object.

So if your still here, it means you are in the same boat, so grab a pattle.  Because javascript objects are messy and unmanagable when it comes to holding large amounts of structured from multple user with multiple requirements and structures.

Remember we are now one server, one data object and that means DIRECT access to the data, no more data serving!

THe only thing left that is a must have and will not end up being eliminated is a data manager that brings back the most essential requirements of structure, constraints and persistance.  

So hense ajsodm was born.  Like a, but not a cache because it is direct access with all the most core features of data caching and serving.  

I won't kid you though it is more risky, if you server is badly behaved with the data it can mess up all the data.  So you have to keep in mind some some of that in terms of security and how your application is designed.

For those of you who are Lua fans, I think youy can relate to that.  And no sorry I am not but I recongnize its beauty, it definitly has a place in heaven.  My point is you have to change your thinking a bit with direct access data stores, if you change a row or table you change it for everyone immediately.  If you want a copy you have to clone or deepCopy it.  You can't make changes to it until you are sure because there is no insert, update or commit.  What you change is already changed in the database.

Ok enough witht the lecture.  We are at pre-alpha but still with all the core features.  Nothing is nailed down yet though but we plan to get out hammer with in the month.

Thanks for reading and if you want to contribute you are welcome.  As long as your contributions outweight the time to it takes to manage the unit testing and pulls.. That means please manage things on your end for your contributions, IE, unit tests, sample, use/usage cases.

THanks!
