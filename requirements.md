# Software Requirements

## Vision

Minimum Length: 3-5 sentences
1. What is the vision of this product?

To allow command line interface, dev friendly access to node module documentation. Users can locally install this as a package through npm. Users can access relevant code fellows node modules documentation and make additions if they have found other resources that they prefer.

2. What pain point does this project solve?

Developers can avoid the google rabbit hole and have assistance finding direction to documentation that has been utilized most frequently by past students or recommended by Code Fellows.


3. Why should we care about your product?

Using this package is time saving and helps give students a good starting place when searching for documentation. Doc links are usually provided in readings or the lab, but unless you've bookmarked them or remember where to find them it often takes a lot of time to find it again even if it *has* been saved amongst 1,000 other bookmarks. The scope of what will be made available is created with Code Fellow students being the first in mind. 

## Scope (In/Out)
**What will your product do**
 - It will provide Code Fellows relevant node module documentation
 - It will be available as an npm package so users can utilize CLI to find resources
 - Users can add additional documents for a module
 - Users can get a list of all available modules

**What will your product not do.**

- Users cannot modify the docs themselves
- It will not automate any code 

### Minimum Viable Product

**What will your MVP functionality be?**

Searching through the list of modules that we have provided, selecting a module and retrieving documentation for that module.

#### What are your stretch goals?

**What stretch goals are you going to aim for?**

1. Allow scoped in search functionality that will display all possible searches withing the same core search.
ex:

- `AWS`
  
  -  `S3`
  
  -  `Lambda`
  
  -   `EB`

2. Save user favorites

3. User accounts and access


## Functional Requirements

- Add, Update, Read and Delete records
- Store information in an API
- Make accessible to the user in the form of a CLI
- Package in an NPM for user install


### Data Flow
Describe the flow of data in your application. Write out what happens from the time the user begins using the app to the time the user is done with the app. Think about the “Happy Path” of the application. Describe through visuals and text what requests are made, and what data is processed, in addition to any other details about how the user moves through the site.

1. User will install npm package
2. User will enter a command to search for a module
3. CLI requests information from DB
4. CLI returns information to user
5. To add/remove documentation user will search for module and use additional command options.


## Non-Functional Requirements
Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.

**Usability** - Anyone can install an use this package by referring to step by step instruction included in our package documentation.

**Stability** - The database is available 99.9% of the time through AWS cloud service


**Testability** -  We will be undertaking test driven development to confirm our functionality with at least 90% coverage.


**Pick 2 non-functional requirements and describe their functionality in your application.** 


- We will make a DB through AWS services which is cloud based. Throughout the process of creating this package we will write our tests prior to writing the logic to ensure overall functionality.





