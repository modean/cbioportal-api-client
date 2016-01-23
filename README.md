# cBio Portal API Client
[![Build Status](https://img.shields.io/circleci/project/nathanmarks/cbioportal-api-client/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/cbioportal-api-client) [![Coverage Status](https://img.shields.io/coveralls/nathanmarks/cbioportal-api-client/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/cbioportal-api-client?branch=master)

[cBio Portal API](http://www.cbioportal.org/web_api.jsp) client. Parses tab separated responses into JSON format. Works in node and in the browser via a module loader such as [Webpack](http://webpack.github.io).

This library can be used programatically or via the command line.

#### Installation

```bash
$ npm install cbioportal-api-client --save
```

#### Programmatic Usage

[API Reference](#api-reference)

```javascript
import CbioPortal from 'cbioportal-api-client';

const cbioPortal = CbioPortal();

cbioPortal.getCancerStudies()
  .then(response => {
    console.log(response); // Prints array of cancer studies returned from API
  });

cbioPortal.getGeneticProfiles({ cancer_study_id: 'gbm_tcga' })
  .then(response => {
    console.log(response); // Prints array of genetic profiles returned from the 'gbm_tcga' study
  });
```

#### Command Line Usage

**Note:** Requires node.

```bash
# global install to use anywhere
$ npm install -g cbioportal-api-client

# print usage info using --help
$ cbioportal-api-client --help

  Usage: cbioportal-api-client [options] [command]


  Commands:

    getCancerStudies               get cancer study meta-data
    getTypesOfCancer               get clinical cancer types
    getGeneticProfiles [options]   get genetic profile data for a cancer study.
    getCaseLists [options]         get case lists stored for a specific cancer study.
    getProfileData [options]       get genomic profile data for one or more genes.

  You can get usage info for specific commands using [command] --help

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format <format>  response format

# example API call, sends JSON formatted response to stdout
$ cbioportal-api-client getProfileData -s gbm_tcga_cnaseq -p gbm_tcga_mutations -g TP53
```

---

## API Reference

<a name="module_cbioportal-api-client"></a>
## cbioportal-api-client ⇒ <code>cbioPortal</code>
Creates a new cBio Portal API client

**See**: [cbioPortal](#module_cbioportal-api-client..cbioPortal)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration options object. |
| config.includeRaw | <code>Boolean</code> | Include the raw TSV response |

**Example**  
Basic usage:

```javascript
import CbioPortal from 'cbioportal-api-client';

const cbioPortal = CbioPortal();

cbioPortal.getCancerStudies()
  .then(response => {
    console.log(response); // Prints array of cancer studies returned from API
  });
```

* [cbioportal-api-client](#module_cbioportal-api-client) ⇒ <code>cbioPortal</code>
    * [~cbioPortal](#module_cbioportal-api-client..cbioPortal) : <code>Object</code>
        * [.getTypesOfCancer()](#module_cbioportal-api-client..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
        * [.getCancerStudies()](#module_cbioportal-api-client..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
        * [.getGeneticProfiles(query)](#module_cbioportal-api-client..cbioPortal+getGeneticProfiles) ⇒ <code>Promise</code>
        * [.getCaseLists(query)](#module_cbioportal-api-client..cbioPortal+getCaseLists) ⇒ <code>Promise</code>
        * [.getProfileData(query)](#module_cbioportal-api-client..cbioPortal+getProfileData) ⇒ <code>Promise</code>


-----

<a name="module_cbioportal-api-client..cbioPortal"></a>
### cbioportal-api-client~cbioPortal : <code>Object</code>
cbioPortal API Object Prototype. Used as the object prototype
when creating an API client object via the module factory method.

**Kind**: inner constant of <code>[cbioportal-api-client](#module_cbioportal-api-client)</code>  
**See**: Use [CbioPortal()](#module_cbioportal-api-client) for object creation.  

* [~cbioPortal](#module_cbioportal-api-client..cbioPortal) : <code>Object</code>
    * [.getTypesOfCancer()](#module_cbioportal-api-client..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
    * [.getCancerStudies()](#module_cbioportal-api-client..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
    * [.getGeneticProfiles(query)](#module_cbioportal-api-client..cbioPortal+getGeneticProfiles) ⇒ <code>Promise</code>
    * [.getCaseLists(query)](#module_cbioportal-api-client..cbioPortal+getCaseLists) ⇒ <code>Promise</code>
    * [.getProfileData(query)](#module_cbioportal-api-client..cbioPortal+getProfileData) ⇒ <code>Promise</code>


-----

<a name="module_cbioportal-api-client..cbioPortal+getTypesOfCancer"></a>
#### cbioPortal.getTypesOfCancer() ⇒ <code>Promise</code>
Retrieves a list of all the clinical types of cancer stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>  
**Returns**: <code>Promise</code> - See fullfills/rejects  
**Fulfills**: <code>Array</code> response data converted from TSV to JSON  

-----

<a name="module_cbioportal-api-client..cbioPortal+getCancerStudies"></a>
#### cbioPortal.getCancerStudies() ⇒ <code>Promise</code>
Retrieves meta-data regarding cancer studies stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>  
**Returns**: <code>Promise</code> - See fullfills/rejects  
**Fulfills**: <code>Array</code> response data converted from TSV to JSON  

-----

<a name="module_cbioportal-api-client..cbioPortal+getGeneticProfiles"></a>
#### cbioPortal.getGeneticProfiles(query) ⇒ <code>Promise</code>
Retrieves meta-data regarding all genetic profiles, e.g.
mutation or copy number profiles, stored about a specific cancer study.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>  
**Returns**: <code>Promise</code> - See fullfills/rejects  
**Fulfills**: <code>Array</code> response data converted from TSV to JSON  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |


-----

<a name="module_cbioportal-api-client..cbioPortal+getCaseLists"></a>
#### cbioPortal.getCaseLists(query) ⇒ <code>Promise</code>
Retrieves meta-data regarding all case lists stored about a specific cancer study.

For example, a within a particular study, only some cases may have sequence data, and another subset of cases may have been sequenced and treated with a specific therapeutic protocol.

Multiple case lists may be associated with each cancer study, and this method enables you to retrieve meta-data regarding all of these case lists.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>  
**Fulfill**: JSON formatted response  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |


-----

<a name="module_cbioportal-api-client..cbioPortal+getProfileData"></a>
#### cbioPortal.getProfileData(query) ⇒ <code>Promise</code>
Retrieves genomic profile data for one or more genes.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>  
**Fulfill**: JSON formatted response  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| options.case_set_id | <code>string</code> | A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study. |
| options.genetic_profile_id | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genetic profile IDs |
| options.gene_list | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs |


-----

