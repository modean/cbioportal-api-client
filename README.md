# cBio Portal API Client
[![npm](https://img.shields.io/npm/v/cbioportal-api-client.svg?style=flat-square)]()
[![Build Status](https://img.shields.io/circleci/project/nathanmarks/cbioportal-api-client/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/cbioportal-api-client) [![Coverage Status](https://img.shields.io/coveralls/nathanmarks/cbioportal-api-client/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/cbioportal-api-client?branch=master)
[![Dependency Status](https://david-dm.org/nathanmarks/cbioportal-api-client.svg?style=flat-square)](https://david-dm.org/nathanmarks/cbioportal-api-client)

[cBio Portal API](http://www.cbioportal.org/web_api.jsp) client. Parses tab separated responses into JSON format. Works in node and in the browser via a module loader such as [Webpack](http://webpack.github.io) (**soon:** just finalizing the browser build).

This library can be used programatically or via the command line.

**Under active development:** This library is currently under active development. The module API is not finalized and is likely to change before v1.

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

    getCancerStudies                 get cancer study meta-data
    getTypesOfCancer                 get clinical cancer types
    getGeneticProfiles [options]     get genetic profile data for a cancer study.
    getCaseLists [options]           get case lists stored for a specific cancer study.
    getProfileData [options]         get genomic profile data for one or more genes.
    getAlterationSummary [options]   summarize alterations for the profile data.

  You can get usage info for specific commands using [command] --help

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format <format>  response format

# example API call, sends JSON formatted response to stdout
$ cbioportal-api-client getProfileData -s gbm_tcga_cnaseq -p gbm_tcga_mutations -g TP53
# .... cut long JSON response

# summarizing alterations
$ cbioportal-api-client getAlterationSummary -s gbm_tcga_cnaseq -p gbm_tcga_mutations,gbm_tcga_gistic -g TP53,MDM2,MDM4
{"summary":{"genes":{"mdm2":{"mutated":1,"cna":9,"combined":10},"mdm4":{"mutated":0,"cna":10,"combined":10},"tp53":{"mutated":29,"cna":2,"combined":30}},"overall":47}}
```

---

# API Reference

## Modules

<dl>
<dt><a href="#module_cbioportal-api-client">cbioportal-api-client</a></dt>
<dd></dd>
<dt><a href="#module_cbioportal-api-client/utils/convertResponse">cbioportal-api-client/utils/convertResponse</a> ⇒ <code>Promise</code></dt>
<dd><p>Converts tab delimited responses to JSON format</p>
</dd>
<dt><a href="#module_cbioportal-api-client/utils/summarizeAlterations">cbioportal-api-client/utils/summarizeAlterations</a> ⇒ <code>Promise</code></dt>
<dd><p>Summarizes alterations for results</p>
</dd>
</dl>

<a name="module_cbioportal-api-client"></a>
## cbioportal-api-client

* [cbioportal-api-client](#module_cbioportal-api-client)
    * _exports_
        * [⏏ exports.default(config)](#exp_module_cbioportal-api-client.default) ⇒ <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>
    * _inner_
        * [~cbioPortal](#module_cbioportal-api-client..cbioPortal) : <code>Object</code>
            * [.getTypesOfCancer()](#module_cbioportal-api-client..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
            * [.getCancerStudies()](#module_cbioportal-api-client..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
            * [.getGeneticProfiles(query)](#module_cbioportal-api-client..cbioPortal+getGeneticProfiles) ⇒ <code>Promise</code>
            * [.getCaseLists(query)](#module_cbioportal-api-client..cbioPortal+getCaseLists) ⇒ <code>Promise</code>
            * [.getProfileData(query)](#module_cbioportal-api-client..cbioPortal+getProfileData) ⇒ <code>Promise</code>
            * [.getAlterationSummary(query)](#module_cbioportal-api-client..cbioPortal+getAlterationSummary) ⇒ <code>Promise</code>


-----

<a name="exp_module_cbioportal-api-client.default"></a>
### cbioportal-api-client ⏏ exports.default(config) ⇒ <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>
Creates a new cBio Portal API client

**Kind**: exports method of <code>[cbioportal-api-client](#module_cbioportal-api-client)</code>

**Returns**: <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration options object. |
| config.requestOpts | <code>Object</code> | Override the request congfiguration object. |

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
    * [.getAlterationSummary(query)](#module_cbioportal-api-client..cbioPortal+getAlterationSummary) ⇒ <code>Promise</code>


-----

<a name="module_cbioportal-api-client..cbioPortal+getTypesOfCancer"></a>
#### cbioPortal.getTypesOfCancer() ⇒ <code>Promise</code>
Retrieves a list of all the clinical types of cancer stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>

**Returns**: <code>Promise</code>
**Fulfills**: <code>Array</code> response data converted from TSV to JSON  

-----

<a name="module_cbioportal-api-client..cbioPortal+getCancerStudies"></a>
#### cbioPortal.getCancerStudies() ⇒ <code>Promise</code>
Retrieves meta-data regarding cancer studies stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>

**Returns**: <code>Promise</code>
**Fulfills**: <code>Array</code> response data converted from TSV to JSON  

-----

<a name="module_cbioportal-api-client..cbioPortal+getGeneticProfiles"></a>
#### cbioPortal.getGeneticProfiles(query) ⇒ <code>Promise</code>
Retrieves meta-data regarding all genetic profiles, e.g.
mutation or copy number profiles, stored about a specific cancer study.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>

**Returns**: <code>Promise</code>
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

**Returns**: <code>Promise</code>
**Fulfill**: response data converted from TSV to JSON  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |


-----

<a name="module_cbioportal-api-client..cbioPortal+getProfileData"></a>
#### cbioPortal.getProfileData(query) ⇒ <code>Promise</code>
Retrieves genomic profile data for one or more genes.

**Note:** If you pass in multiple genetic profile IDs and multiple genes, the library will make multiple requests as the API does not support this type of query.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>

**Returns**: <code>Promise</code>
**Fulfill**: response data converted from TSV to JSON  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.case_set_id | <code>string</code> | A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study. |
| query.genetic_profile_id | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genetic profile IDs |
| query.gene_list | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs |


-----

<a name="module_cbioportal-api-client..cbioPortal+getAlterationSummary"></a>
#### cbioPortal.getAlterationSummary(query) ⇒ <code>Promise</code>
Summarize gene alterations

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client..cbioPortal)</code>

**Returns**: <code>Promise</code>

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.case_set_id | <code>string</code> | A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study. |
| query.genetic_profile_id | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genetic profile IDs |
| query.gene_list | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs |


-----

<a name="module_cbioportal-api-client/utils/convertResponse"></a>
## cbioportal-api-client/utils/convertResponse ⇒ <code>Promise</code>
Converts tab delimited responses to JSON format

**Returns**: <code>Promise</code> - Resolves with the response JSON

| Param | Type | Description |
| --- | --- | --- |
| response | <code>string</code> | TSV string |


-----

<a name="module_cbioportal-api-client/utils/summarizeAlterations"></a>
## cbioportal-api-client/utils/summarizeAlterations ⇒ <code>Promise</code>
Summarizes alterations for results

**Returns**: <code>Promise</code> - Resolves with the summary
**Fulfills**: <code>Object</code> Object with results, see example  

| Param | Type | Description |
| --- | --- | --- |
| dataSets | <code>Object</code> &#124; <code>Array</code> | Converted response dataset(s) |

**Example**  
Basic Usage:

```javascript
import CbioPortal from 'cbioportal-api-client';
import { summarizeAlterations } from 'cbioportal-api-client/dist/utils';

const cbioPortal = CbioPortal();

cbioPortal.getProfileData({
  case_set_id: 'gbm_tcga_cnaseq',
  genetic_profile_id: ['gbm_tcga_mutations', 'gbm_tcga_gistic'],
  gene_list: ['tp53', 'mdm2', 'mdm4']
})
.then(response => summarizeAlterations(response))
.then(result => console.log(result));

// console.log output

{
  summary: {
    genes: {
      tp53: {
        mutated: 29,
        cna: 2,
        combined: 30
      },
      mdm2: {
        mutated: 1,
        cna: 9,
        combined: 10
      },
      mdm4: {
        mutated: 0,
        cna: 10,
        combined: 10
      }
    },
    overall: 47
  }
}
```

-----

