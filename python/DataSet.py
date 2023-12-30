import json
import copy
import pandas as pd

class DataSet:
    EnumRecordType = {
        "RECORD": "record",
        "ROW": "row",
        "COLUMN": "column",
    }

    def __init__(self, meta=None, data=None):
        if meta is None:
            meta = {}
        if data is None:
            data = []

        self.meta = {"type": self.EnumRecordType["RECORD"], "headers": [], **meta}
        self.data = list(data)

        self.meta["headers"] = self.analyze(self)

    @staticmethod
    def analyze(dataset):
        if not dataset.data:
            return []

        if dataset.meta["type"] == DataSet.EnumRecordType["RECORD"]:
            return list(dataset.data[0].keys())
        elif dataset.meta["type"] == DataSet.EnumRecordType["ROW"]:
            return dataset.data[0]
        elif dataset.meta["type"] == DataSet.EnumRecordType["COLUMN"]:
            return [column[0] for column in dataset.data]

        return []

    @staticmethod
    def create(*args, **kwargs):
        return DataSet(*args, **kwargs)

    @staticmethod
    def copy(dataset, meta=None, reanalyze=True):
        if meta is None:
            meta = {}

        next_dataset = copy.deepcopy(dataset)
        next_meta = {**next_dataset.meta, **meta}

        if reanalyze:
            next_meta["headers"] = DataSet.analyze(next_dataset)

        return DataSet(meta=next_meta, data=next_dataset.data)

    @staticmethod
    def to_json(dataset):
        return json.dumps({
            "meta": dataset.meta,
            "data": dataset.data
        })

    @staticmethod
    def from_json(json_str):
        data_dict = json.loads(json_str)
        return DataSet(meta=data_dict.get("meta"), data=data_dict.get("data"))

    def to_records(self):
        if self.meta["type"] == self.EnumRecordType["RECORD"]:
            return DataSet.create(meta=self.meta, data=self.data)

        records = []
        if self.meta["type"] == self.EnumRecordType["ROW"]:
            for row in self.data:
                record = {self.meta["headers"][i]: row[i] for i in range(len(self.meta["headers"]))}
                records.append(record)
        elif self.meta["type"] == self.EnumRecordType["COLUMN"]:
            for i in range(len(self.data[0])):
                record = {self.meta["headers"][j]: self.data[j][i] for j in range(len(self.meta["headers"]))}
                records.append(record)

        return DataSet.create(meta={"type": self.EnumRecordType["RECORD"], "headers": self.meta["headers"]}, data=records)

    def to_rows(self):
        if self.meta["type"] == self.EnumRecordType["ROW"]:
            return DataSet.create(meta=self.meta, data=self.data)

        rows = []
        if self.meta["type"] == self.EnumRecordType["RECORD"]:
            for record in self.data:
                row = [record[header] for header in self.meta["headers"]]
                rows.append(row)
        elif self.meta["type"] == self.EnumRecordType["COLUMN"]:
            for i in range(len(self.data[0])):
                row = [self.data[j][i] for j in range(len(self.meta["headers"]))]
                rows.append(row)

        return DataSet.create(meta={"type": self.EnumRecordType["ROW"], "headers": self.meta["headers"]}, data=rows)

    def to_columns(self):
        if self.meta["type"] == self.EnumRecordType["COLUMN"]:
            return DataSet.create(meta=self.meta, data=self.data)

        columns = []
        if self.meta["type"] == self.EnumRecordType["RECORD"]:
            for header in self.meta["headers"]:
                column = [record[header] for record in self.data]
                columns.append(column)
        elif self.meta["type"] == self.EnumRecordType["ROW"]:
            for i in range(len(self.meta["headers"])):
                column = [row[i] for row in self.data]
                columns.append(column)

        return DataSet.create(meta={"type": self.EnumRecordType["COLUMN"], "headers": self.meta["headers"]}, data=columns)

    def get_records(self):
        return self.to_records().data

    def get_rows(self, include_headers=True):
        rows = self.to_rows().data
        if include_headers:
            return [self.meta["headers"]] + rows
        return rows

    def get_columns(self, include_headers=True):
        columns = self.to_columns().data
        if include_headers:
            return [self.meta["headers"]] + columns
        return columns

    def filter(self, fn, *args):
        filtered_data = []
        for record in self.data:
            if isinstance(fn, list):
                if len(fn) != len(self.data):
                    raise ValueError("Invalid filter length")
                if fn[self.data.index(record)]:
                    filtered_data.append(record)
            elif callable(fn):
                if fn(record, *args):
                    filtered_data.append(record)

        return DataSet.create(meta=self.meta, data=filtered_data)

    def map(self, fn, *args):
        mapped_data = [fn(record, *args) for record in self.data]
        return DataSet.create(meta=self.meta, data=mapped_data)

    def reduce(self, fn, *args):
        result = None
        for record in self.data:
            result = fn(result, record, *args)
        return result

    @staticmethod
    def transform_to_dataset(data, modeler, analyzer):
        if not callable(modeler) or not callable(analyzer):
            raise ValueError("Modeler and analyzer functions are required")

        modeled_data = modeler(data)
        analyzed_meta = analyzer(data)

        return DataSet(meta=analyzed_meta, data=modeled_data)

    def to_dataframe(self):
        """
        Converts the DataSet to a regular dataframe (list of dictionaries).
        """
        return self.get_records()

    def to_pandas(self):
        """
        Converts the DataSet to a pandas DataFrame.
        """
        if self.meta['type'] == self.EnumRecordType['RECORD']:
            return pd.DataFrame(self.data)
        elif self.meta['type'] == self.EnumRecordType['ROW']:
            return pd.DataFrame(self.data, columns=self.meta['headers'])
        elif self.meta['type'] == self.EnumRecordType['COLUMN']:
            data_dict = {self.meta['headers'][i]: column for i, column in enumerate(self.data)}
            return pd.DataFrame(data_dict)

# Example usage:
# json_data = '{"meta": {"type": "record", "headers": ["a", "b"]}, "data": [{"a": 1, "b": 2}, {"a": 3, "b": 4}]}'
# dataset = DataSet.from_json(json_data)
# print(dataset.get_records())
# print(dataset.to_pandas())

# Test
# Example data in JSON format
json_data = '{"meta": {"type": "record", "headers": ["a", "b"]}, "data": [{"a": 1, "b": 2}, {"a": 3, "b": 4}]}'

# Create DataSet instance from JSON data
dataset = DataSet.from_json(json_data)

# Get records and print them
records = dataset.get_records()
print("Records:\n", records)

# Convert to regular dataframe and perform a check
regular_df = dataset.to_dataframe()
print("\nRegular DataFrame:\n", regular_df)
assert all(isinstance(row, dict) for row in regular_df), "Each item in regular DataFrame should be a dictionary."

# Convert to pandas DataFrame and perform checks
pandas_df = dataset.to_pandas()
print("\nPandas DataFrame:\n", pandas_df)
assert isinstance(pandas_df, pd.DataFrame), "The object should be a pandas DataFrame."
assert list(pandas_df.columns) == dataset.meta['headers'], "DataFrame headers should match dataset headers."

# Additional check for content
assert pandas_df.equals(pd.DataFrame(records)), "Pandas DataFrame content should match the records."