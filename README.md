# cBio Portal API Client
[![Build Status](https://img.shields.io/circleci/project/nathanmarks/cbioportal-api-client/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/cbioportal-api-client) [![Coverage Status](https://img.shields.io/coveralls/nathanmarks/cbioportal-api-client/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/cbioportal-api-client?branch=master)

[cBio Portal API](http://www.cbioportal.org/web_api.jsp) client. Parses tab separated responses into JSON format. Works in node and in the browser via a module loader such as [Webpack](http://webpack.github.io).

This library can be used programatically or via the command line.

##### Installation

```bash
npm install cbioportal-api-client --save
```

##### Programmatic Usage

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

##### Command Line Usage

**Note:** Requires node.

```bash
npm install -g cbioportal-api-client  # Global install to use anywhere
```

---

## API Reference
<!--

* [cbioportal-api-client](#module_cbioportal-api-client)
    * [module.exports(config)](#exp_module_cbioportal-api-client--module.exports) ⇒ <code>cbioPortal</code> ⏏
        * [~cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal) : <code>Object</code>
            * [.getTypesOfCancer()](#module_cbioportal-api-client--module.exports..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
            * [.getCancerStudies()](#module_cbioportal-api-client--module.exports..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
            * [.getGeneticProfiles(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getGeneticProfiles) ⇒ <code>Promise(data)</code>
            * [.getCaseLists(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getCaseLists) ⇒ <code>Promise(data)</code>
            * [.getProfileData()](#module_cbioportal-api-client--module.exports..cbioPortal+getProfileData) ⇒ <code>Promise(data)</code>

<a name="exp_module_cbioportal-api-client--module.exports"></a>
### module.exports(config) ⇒ <code>cbioPortal</code> ⏏
Creates a new cBio Portal API client

**Kind**: Exported function

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
<a name="module_cbioportal-api-client--module.exports..cbioPortal"></a>
#### module.exports~cbioPortal : <code>Object</code>
cbioPortal API Object Prototype. Used as the object prototype
when creating an API client object via the module factory method.

**Kind**: inner constant of <code>[module.exports](#exp_module_cbioportal-api-client--module.exports)</code>
**See**: Use [CbioPortal()](module:cbioportal-api-client~CbioPortal) for object creation.

* [~cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal) : <code>Object</code>
    * [.getTypesOfCancer()](#module_cbioportal-api-client--module.exports..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
    * [.getCancerStudies()](#module_cbioportal-api-client--module.exports..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
    * [.getGeneticProfiles(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getGeneticProfiles) ⇒ <code>Promise(data)</code>
    * [.getCaseLists(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getCaseLists) ⇒ <code>Promise(data)</code>
    * [.getProfileData()](#module_cbioportal-api-client--module.exports..cbioPortal+getProfileData) ⇒ <code>Promise(data)</code>

<a name="module_cbioportal-api-client--module.exports..cbioPortal+getTypesOfCancer"></a>
##### cbioPortal.getTypesOfCancer() ⇒ <code>Promise</code>
Retrieves a list of all the clinical types of cancer stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>
**Returns**: <code>Promise</code> - resolves with JSON data
<a name="module_cbioportal-api-client--module.exports..cbioPortal+getCancerStudies"></a>
##### cbioPortal.getCancerStudies() ⇒ <code>Promise</code>
Retrieves meta-data regarding cancer studies stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>
**Returns**: <code>Promise</code> - resolves with JSON data
<a name="module_cbioportal-api-client--module.exports..cbioPortal+getGeneticProfiles"></a>
##### cbioPortal.getGeneticProfiles(query) ⇒ <code>Promise(data)</code>
Retrieves meta-data regarding all genetic profiles, e.g.
mutation or copy number profiles, stored about a specific cancer study.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>
**Returns**: <code>Promise(data)</code> - resolves with JSON data

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |

<a name="module_cbioportal-api-client--module.exports..cbioPortal+getCaseLists"></a>
##### cbioPortal.getCaseLists(query) ⇒ <code>Promise(data)</code>
Retrieves meta-data regarding all case lists stored about a specific cancer study.

For example, a within a particular study, only some cases may have sequence data, and another subset of cases may have been sequenced and treated with a specific therapeutic protocol.

Multiple case lists may be associated with each cancer study, and this method enables you to retrieve meta-data regarding all of these case lists.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |

<a name="module_cbioportal-api-client--module.exports..cbioPortal+getProfileData"></a>
##### cbioPortal.getProfileData() ⇒ <code>Promise(data)</code>
Retrieves genomic profile data for one or more genes.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>

| Param | Type | Description |
| --- | --- | --- |
| options.case_set_id | <code>string</code> | A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study. |
| options.genetic_profile_id | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genetic profile IDs |
| options.gene_list | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs |

-->

## Modules

<dl>
<dt><a href="#module_cbioportal-api-client">cbioportal-api-client</a></dt>
<dd></dd>
<dt><a href="#module_cbioportal-api-client/utils/convertResponse">cbioportal-api-client/utils/convertResponse</a></dt>
<dd></dd>
<dt><a href="#module_cbioportal-api-client/utils/summarizeAlterations">cbioportal-api-client/utils/summarizeAlterations</a></dt>
<dd></dd>
</dl>

<a name="module_cbioportal-api-client"></a>
## cbioportal-api-client

* [cbioportal-api-client](#module_cbioportal-api-client)
    * [module.exports(config)](#exp_module_cbioportal-api-client--module.exports) ⇒ <code>cbioPortal</code> ⏏
        * [~cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal) : <code>Object</code>
            * [.getTypesOfCancer()](#module_cbioportal-api-client--module.exports..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
            * [.getCancerStudies()](#module_cbioportal-api-client--module.exports..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
            * [.getGeneticProfiles(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getGeneticProfiles) ⇒ <code>Promise(data)</code>
            * [.getCaseLists(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getCaseLists) ⇒ <code>Promise(data)</code>
            * [.getProfileData()](#module_cbioportal-api-client--module.exports..cbioPortal+getProfileData) ⇒ <code>Promise(data)</code>

<a name="exp_module_cbioportal-api-client--module.exports"></a>
### module.exports(config) ⇒ <code>cbioPortal</code> ⏏
Creates a new cBio Portal API client

**Kind**: Exported function

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
<a name="module_cbioportal-api-client--module.exports..cbioPortal"></a>
#### module.exports~cbioPortal : <code>Object</code>
cbioPortal API Object Prototype. Used as the object prototype
when creating an API client object via the module factory method.

**Kind**: inner constant of <code>[module.exports](#exp_module_cbioportal-api-client--module.exports)</code>
**See**: Use [CbioPortal()](module:cbioportal-api-client~CbioPortal) for object creation.

* [~cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal) : <code>Object</code>
    * [.getTypesOfCancer()](#module_cbioportal-api-client--module.exports..cbioPortal+getTypesOfCancer) ⇒ <code>Promise</code>
    * [.getCancerStudies()](#module_cbioportal-api-client--module.exports..cbioPortal+getCancerStudies) ⇒ <code>Promise</code>
    * [.getGeneticProfiles(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getGeneticProfiles) ⇒ <code>Promise(data)</code>
    * [.getCaseLists(query)](#module_cbioportal-api-client--module.exports..cbioPortal+getCaseLists) ⇒ <code>Promise(data)</code>
    * [.getProfileData()](#module_cbioportal-api-client--module.exports..cbioPortal+getProfileData) ⇒ <code>Promise(data)</code>

<a name="module_cbioportal-api-client--module.exports..cbioPortal+getTypesOfCancer"></a>
##### cbioPortal.getTypesOfCancer() ⇒ <code>Promise</code>
Retrieves a list of all the clinical types of cancer stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>
**Returns**: <code>Promise</code> - resolves with JSON data
<a name="module_cbioportal-api-client--module.exports..cbioPortal+getCancerStudies"></a>
##### cbioPortal.getCancerStudies() ⇒ <code>Promise</code>
Retrieves meta-data regarding cancer studies stored on the server.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>
**Returns**: <code>Promise</code> - resolves with JSON data
<a name="module_cbioportal-api-client--module.exports..cbioPortal+getGeneticProfiles"></a>
##### cbioPortal.getGeneticProfiles(query) ⇒ <code>Promise(data)</code>
Retrieves meta-data regarding all genetic profiles, e.g.
mutation or copy number profiles, stored about a specific cancer study.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>
**Returns**: <code>Promise(data)</code> - resolves with JSON data

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |

<a name="module_cbioportal-api-client--module.exports..cbioPortal+getCaseLists"></a>
##### cbioPortal.getCaseLists(query) ⇒ <code>Promise(data)</code>
Retrieves meta-data regarding all case lists stored about a specific cancer study.

For example, a within a particular study, only some cases may have sequence data, and another subset of cases may have been sequenced and treated with a specific therapeutic protocol.

Multiple case lists may be associated with each cancer study, and this method enables you to retrieve meta-data regarding all of these case lists.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> |  |
| query.cancer_study_id | <code>string</code> | Cancer study ID |

<a name="module_cbioportal-api-client--module.exports..cbioPortal+getProfileData"></a>
##### cbioPortal.getProfileData() ⇒ <code>Promise(data)</code>
Retrieves genomic profile data for one or more genes.

**Kind**: instance method of <code>[cbioPortal](#module_cbioportal-api-client--module.exports..cbioPortal)</code>

| Param | Type | Description |
| --- | --- | --- |
| options.case_set_id | <code>string</code> | A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study. |
| options.genetic_profile_id | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genetic profile IDs |
| options.gene_list | <code>Array.&lt;string&gt;</code> &#124; <code>string</code> | One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs |

<a name="module_cbioportal-api-client/utils/convertResponse"></a>
## cbioportal-api-client/utils/convertResponse
<a name="exp_module_cbioportal-api-client/utils/convertResponse--module.exports"></a>
### module.exports(response) ⇒ <code>Promise</code> ⏏
Converts tab delimited responses to JSON format

**Kind**: Exported function
**Returns**: <code>Promise</code> - Resolves with the response JSON

| Param | Type | Description |
| --- | --- | --- |
| response | <code>string</code> | TSV string |

<a name="module_cbioportal-api-client/utils/summarizeAlterations"></a>
## cbioportal-api-client/utils/summarizeAlterations
