import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from botocore.exceptions import ClientError
import os

def get_s3_client():
    session = boto3.Session(profile_name='DevOpsTeam-014498640042') 
    return session.client('s3')

def delete_s3_object(bucket_name, object_key):
    s3_client = boto3.client('s3')
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=object_key)
        return True
    except ClientError as e:
        print(f"Error deleting S3 object {object_key}: {e}")
        return False
def generate_presigned_url(bucket_name, object_key, expiration=3600):
      """Generate a pre-signed URL for an S3 object with a default expiration of 1 hour."""
      s3_client = get_s3_client()
      try:
          if not object_key or not (object_key.startswith('videos/') or object_key.startswith('lab_guides/')):
              return None
          url = s3_client.generate_presigned_url(
              'get_object',
              Params={'Bucket': bucket_name, 'Key': object_key},
              ExpiresIn=expiration
          )
          return url
      except NoCredentialsError:
          print("No AWS credentials found")
          return None
      except ClientError as e:
          print(f"Error generating presigned URL: {e}")
          return None

def upload_fileobj(file_obj, bucket_name, object_key):
      """Upload a file object directly to S3."""
      s3_client = get_s3_client()
      try:
          s3_client.upload_fileobj(file_obj, bucket_name, object_key)
          print(f"Uploaded to {bucket_name}/{object_key}")
          return True
      except ClientError as e:
          print(f"Error uploading file: {e}")
          return False


