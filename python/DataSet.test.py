import pandas as pd
from DataSet import DataSet

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