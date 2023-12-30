import React, { useState, useMemo } from "react";

export const DataSetTable = ({ dataSet, rowsPerPage = 10 }) => {
	const [ currentPage, setCurrentPage ] = useState(1);
	const headers = dataSet.meta.headers;

	// Memoize records and total pages
	const { records, totalPages } = useMemo(() => {
		const records = dataSet.getRecords();
		const totalPages = Math.ceil(records.length / rowsPerPage);
		return { records, totalPages };
	}, [ dataSet, rowsPerPage ]);

	// Calculate the records to display on the current page
	const displayedRecords = useMemo(() => {
		const startIndex = (currentPage - 1) * rowsPerPage;
		return records.slice(startIndex, startIndex + rowsPerPage);
	}, [ currentPage, records, rowsPerPage ]);

	// Function to change page
	const setPage = (page) => {
		if(page < 1 || page > totalPages) return;
		setCurrentPage(page);
	};

	return (
		<div>
			<table>
				<thead>
					<tr>
						{ headers.map(header => <th key={ header }>{ header }</th>) }
					</tr>
				</thead>
				<tbody>
					{ displayedRecords.map((record, index) => (
						<tr key={ index }>
							{ headers.map(header => <td key={ `${ header }-${ index }` }>{ record[ header ] }</td>) }
						</tr>
					)) }
				</tbody>
			</table>
			<div>
				<button onClick={ () => setPage(currentPage - 1) } disabled={ currentPage === 1 }>Previous</button>
				<span> Page { currentPage } of { totalPages } </span>
				<button onClick={ () => setPage(currentPage + 1) } disabled={ currentPage === totalPages }>Next</button>
			</div>
		</div>
	);
};

export default DataSetTable;