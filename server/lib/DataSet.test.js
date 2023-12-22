import DataSet from "./DataSet.js";
import View from "./View.js";

const data = DataSet.Create({
	meta: {
		type: DataSet.EnumRecordType.RECORD,
		headers: [
			"Name",
			"Age",
		],
	},
	data: [
		{
			Name: "John",
			Age: 30,
		},
		{
			Name: "Jane",
			Age: 25,
		},
		{
			Name: "Joe",
			Age: 20,
		},
		{
			Name: "Jack",
			Age: 35,
		},
		{
			Name: "Jill",
			Age: 40,
		},
	],
});

console.log(data);
console.log(
	data
		.filter((record) => record.Age > 25)
);
console.log(
	data
		.filter((record) => record.Age > 30)
		.reduce((sum, record) => sum + record.Age, 0)
);

const view = View.Create({
	source: data,
	transformations: [
		[ "filter", (record) => record.Age > 25 ],
	],
});
console.log(view);
console.log(view.getRows());
console.log(view.getColumns());