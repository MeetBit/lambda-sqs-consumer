# Lambda SQS Consumer

Lambda SQS Consumer is a template for a NodeJS AWS Lamda consumer for an AWS SQS queue.

## Requirements

Before getting started, make sure you **have the following installed** on your system:

- **Node 16.14.x**  (use nvm to install)
- **Yarn 1.2x.x**
- **AWS CLI 2.3.x**
- **Zip 3.0** (UNIX systems)
- **7-Zip** (Windows)

## Environment Variables

Lambda SQS Consumer requires a few environment variables to run. Create a `.env` file in the project's root with the following values:
| Key       | Value          |
| --------- | -------------- |
| QUEUE_URL | your_queue_url |

## Getting Started
To get started, you will have to setup your SQS Queue and Lambda Function.

### SQS Queue
1. **Create SQS queue**. Take note of your queue url.
   ```bash
   ## replace `hello-world-queue` with your Queue Name
   ## replace `us-east-1` with your region
   aws sqs create-queue --queue-name hello-world-queue --attributes file://aws-setup/queue-attributes.json --region us-east-1
   ```
2. **Provide permissions to message senders**. The easiest way to do this is to use the **AWS Console** online. Go to **SQS** > **Your Queue** > **Access Policy** > **Access policy (Permissions)** > **Edit** > **Access Policy**. It should look something like the one below. In the object under the `Statement` array with an `Sid` of `"__sender_statement"`, add the ARNs of IAM Users or Roles that would need to send messages to this queue under the `Principal.AWS` array.
   ```json
   {
    "Version": "2008-10-17",
    "Id": "__default_policy_ID",
    "Statement": [
      {
        "Sid": "__owner_statement",
        ...
      },
      {
        "Sid": "__sender_statement",
        "Effect": "Allow",
        "Principal": {
          "AWS": [
            "iam-role-or-user-arn"
          ]
        },
        "Action": "SQS:SendMessage",
        "Resource": "sqs-arn"
      }
    ]
   }
   ```

### Lambda Function

1. **Package the Lambda Function**
   ```bash
    ## linux / mac
    yarn run package

    ## windows
    yarn run package-win
   ```
2. **Create IAM role for the lamda function**.
   ```bash
    ## replace `hello-world-role` with your intended IAM role name
    aws iam create-role --role-name hello-world-role --assume-role-policy-document file://aws-setup/lamda-role.json
   ```
3. **Create the Lambda Function**
   ```bash

    ## replace `hello-world` with your function name
    ## replace `role-arn` with your created role arn
    ## replace `us-east-1` with your region
    aws lambda create-function --function-name hello-world --zip-file fileb://function.zip --runtime nodejs16.x --role role-arn --region us-east-1 --handler index.handler
   ```
4. **Configure Environment Vairables**. The easiest way to do this is through the **AWS Console** online. Go to **Lambda** > **Functions** > **Your Function** > **Configuration** > **Environment Variables** > **Edit**. Add the following environment variables along with any other variables your function requires.
5. **Add Lambda Trigger to your queue**. The easiest way to do this is through the **AWS Console** online. Go to **SQS** > **Your Queue** > **Lambda triggers** > **Configure Lambda trigger function**. Find and choose your previously created Lambda function.
   | Secret    | Value          |
   | --------- | -------------- |
   | QUEUE_URL | your_queue_url |

### Customization
You can customize your SQS queue and Lambda function by editing `/aws-setup/queue-attributes.json` and `/aws-setup/lambda-role.json`. You can also edit the CLI commands when creating the SQS queue, IAM role and lambda function to reflect your choices.

## Deployment
Whenever you make changes to your Lambda function, you can deploy your code by packaging your function first and then deploying. If you wish to use CI/CD, this template includes provisions for using Github Actions for CI/CD which is explained in the next section.
1. **Package the Lambda Function**
   ```bash
    ## linux / mac
    yarn run package

    ## windows
    yarn run package-win
   ```
3. **Update the Lambda Function**
   ```bash

    ## replace `hello-world` with your function name
    aws lambda update-function-code --function-name hello-world --zip-file fileb://function.zip
   ```

## CI/CD
Included in this template are provisions to use Github Actions for CI/CD. By default, your lambda function is updated when a pull request to the `master` branch is closed.

### Setup
1. **Configure Action**. In `.github/workflows/ci-cd.yml`, change `hello-world` in line 48 to the name of your Lambda function. You may also configure what can trigger the Github Action in lines 4-8.
2. **Create IAM User for the Github Action**. The easiest way is to do this through the **AWS Console** online. Create a new policy for the user with the permissions below. Take note of the the Access Key and Secret.
   ```json
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "lambda:UpdateFunctionCode",
                  "lambda:UpdateFunctionConfiguration"
              ],
              "Resource": [
                  "*",
              ]
          }
      ]
    }
   ```
3. **Setup Github Repository Secrets**. To do this, go to **Your Repositoy** > **Settings** > **Secrets & variables** > **Actions** > **New repository secret** and add the following:
   | Secret                       | Value          |
   | ---------------------------- | -------------- |
   | ACTION_AWS_ACCESS_KEY_ID     | iam_access_key |
   | ACTION_AWS_SECRET_ACCESS_KEY | iam_secret     |
   | AWS_REGION                   | lambda_region  |

## Resources
This template uses different dependencies/frameworks/services. **Here are links to the most important packages** you will need as you use this template.

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS Javascript SDK](https://aws.amazon.com/sdk-for-javascript/)
- [Github Actions](https://docs.github.com/en/actions)

## License
Lambda SQS Consumer is under the [MIT License](https://github.com/MeetBit/lambda-sqs-consumer/blob/master/LICENSE).