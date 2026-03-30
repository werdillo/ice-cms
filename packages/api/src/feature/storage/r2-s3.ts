import { AwsClient } from 'aws4fetch'

function getAwsClient(config: R2S3Config): AwsClient {
  return new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: 's3',
    region: 'auto',
  })
}

export type R2S3Config = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
}

export type R2S3PutResult = {
  url: string
  key: string
}

function getR2ObjectUrl(accountId: string, bucketName: string, key: string): string {
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`
}

export async function r2S3Put(
  config: R2S3Config,
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<R2S3PutResult> {
  const client = getAwsClient(config)
  const url = getR2ObjectUrl(config.accountId, config.bucketName, key)

  const res = await client.fetch(url, {
    method: 'PUT',
    body,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(body.byteLength),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`R2 S3 PUT failed: ${res.status} ${text}`)
  }

  return { url, key }
}

export async function r2S3Delete(
  config: R2S3Config,
  key: string
): Promise<void> {
  const client = getAwsClient(config)
  const url = getR2ObjectUrl(config.accountId, config.bucketName, key)

  const res = await client.fetch(url, { method: 'DELETE' })

  // 204 No Content = success, 404 = already gone — both are fine
  if (!res.ok && res.status !== 404) {
    const text = await res.text()
    throw new Error(`R2 S3 DELETE failed: ${res.status} ${text}`)
  }
}
