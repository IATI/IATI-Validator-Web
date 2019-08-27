---
title: Validate file upload
---

File upload, [see also API doc](https://api-doc.dataworkbench.io/?version=latest#217f2006-7df9-4e5a-8ffe-b4851a737f93)

## Front end component

```mermaid
sequenceDiagram
	participant FE as front-end
	participant API
	participant DS as Test datasets info
	participant Storage
	
	note over FE, Storage: Step 1: select file
	activate FE
	FE ->> FE: select file
	
	note over FE, Storage: Step 2: upload
	FE ->>+ API: POST /api/test-datasets/upload
	
	API -->>+ Storage: upload
	Storage -->>- API: unique filename

	API -->>+ DS: create test dataset record
	DS -->>- API: dataset record
	
    API -->>- FE: dataset record
	
	note over FE, Storage: Step 3: validate
	
	FE ->>- FE: go to /validate/$datasetid
	
	note over FE, Storage: Show files overview
	activate FE
	loop every 2 seconds
		FE ->>+ API: GET /api/iati-testdatasets/$datasetid
		API ->>+ DS: get test dataset info
		DS -->>- API: dataset info
		API -->>- FE: dataset info
		
		FE ->> FE: update page
	end	
	deactivate FE
	
	note over FE, Storage: Show file validation results ($fileid)
	activate FE
	FE ->>+ API: get dataset info $fileid
	API ->>+ DS: GET /api/iati-testdatasets for $fileid
	DS -->>- API: dataset record
	API -->>- FE: dataset record
	
	FE ->>+ API: get JSON file $fileid
	API ->>+ Storage: get JSON file $fileid
	Storage -->>- API: file
	API -->>- FE: file
	deactivate FE
```

## Back end component

Runs multiple instances of a loop that asks for a file without validation results, then runs the validation.

The "store results" portion in the diagram is presented as a single action here, but consists of separate steps for each type of feedback file (JSON, SVRL).

```mermaid
sequenceDiagram
	participant V as Validator test files
	participant API
	participant DS as Test datasets info
	participant Storage
		
	loop validate files
		activate V
		V ->>+ API: get a test dataset without validation
		API -->>- V: test dataset info

		alt test dataset found to be processed
			V ->>+ API: update dataset to indicate processing
			API -->>- V: updated record
		
			V ->>+ API: get test dataset
			API ->>+ Storage: get file
			Storage -->>- API: file
			API -->>- V: file
			
			V -->>+ API: store results
			API -->>+ Storage: store files
			Storage -->>- API: file
			
			API ->>+ DS: update test dataset info
			DS -->>- API: test dataset info
			
			API -->>- V: result
		else do nothing
			V ->> V: wait 1 second
		end
		deactivate V
	end
```

