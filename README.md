# Scale EC2 Instance With Approval

This integration will allow you to list all your EC2 instances and scale them from within Slack. It requires you to ask for approval before the resize occurs, and captures the workflow progress in Slack.

## Before you start

You'll need a free Transposit account. You'll also need the ability to install an application on Slack. Finally, you'll need an AWS account where you can create an IAM user.

### AWS setup

  * Create an IAM user with the following permissions: `AmazonEC2FullAccess`. If you are an IAM expert, write a policy that is more constrained, but still lets a user start, stop, describe EC2 instances as well as modify an EC2 instance type.
  * Start up one or more `t2.nano` EC2 instances in a region. Note that region.

## Transposit setup

  * [Fork](https://console.transposit.com/t/transposit-sample/scale_ec2_with_approval?fork=true) the app
  * Navigate to **Users > User Configuration > Registration and Sign-in** and restrict to your specific whitelisted workspaces. You can find that by logging into your Slack workspace on the web and taking the string after `client` in the URL (it will look something `TMHK6U8DT`).
  * Lock the users who can login to your slack workspace (because you are providing a general Slack key).
  * Navigate to **Code > Data Connections > aws_ec2** and click the "Edit" button under "Configuration". Update this to point to the region where you started your EC2 instances.

## Slack setup

To interact with your bot, you need to create a Slack App. Here's the [entire guide](https://www.transposit.com/docs/guides/slack/chatbots/), but the cliff notes are:

  * Navigate to **Deploy > Endpoints Keys** and copy the `webhook` url (something like `https://scale-ec2-with-approval-xxx.transposit.io/api/v1/execute-http/webhook?api_key=xxxx`). 
  * Navigate to **Deploy > Endpoints Keys** and copy the `respond_to_resize` url (something like `https://scale-ec2-with-approval-xxx.transposit.io/api/v1/execute-http/respond_to_resize?api_key=xxxx`). 
  * Create a [new Slack App](https://api.slack.com/apps).
  * In the configuration of the Slack app:
    * Navigate to **Bot Users** and create a bot user for the app (I named mine 'approvalbot')
    * Navigate to **Interactive Components** and set the 'Request URL' to  the `respond_to_resize` URL from above.
    * Navigate to **OAuth & Permissions** and give your app the following OAuth scopes: `bot` and `chat:write:bot`. Use https://accounts.transposit.com/oauth/v2/handle-redirect for the redirect URL.
    * Navigate to **Event Subscriptions** and subscribe to the `app_mention` event. Use the `webhook` URL from above for the 'Request URL'.
    * Navigate to **Basic Information** and set up the Transposit app to act as the bot user by copying the client secret and following the [instructions here](https://www.transposit.com/docs/guides/slack/chatbots/#acting-as-your-bot-user).
    * Navigate to **Install App** and install the app to your workspace.
  * Create or choose a channel for the posts. Make sure you have at least two Slack users in the account.
  * Invite the bot user to your channel: `/invite @approvalbot`

## Transposit setup part 2

  * Navigate to **Deploy > Production Keys** and add the Slack key. 

## Invite users to signup

This application uses the permissions of each user to act on the EC2 instances. This means that each user has to sign up. If they don't have permissions to update the EC2 instances, they won't be able to execute the command.

* Navigate to **Users > User Configuration** and note the URL (it'll be something like https://scale-ec2-with-approval-xxxx.transposit.io). Send users to that URL.
* They'll login with Slack.
* They'll enter their IAM Access Key Id and Secret Key.

## Use the app

As a user who has signed up, go the Slack channel where you previously invited `@approvalbot`.

To see the help message: `@approvalbot help`

To list your EC2 instances: `@approvalbot list-ec2-instances`

To resize your EC2 instances: `@approvalbot resize-ec2-instance i-xxxxxx approver @ApproverUser`

This will tag ApproverUser and ask them to approve or reject this request. If they approve it, the resize operation will commence.

## Take it further

* Update the list of images to be larger.
* Have the approver be a manager or infrastructure owner. You could verify this by tying into a Lambda that queries a corporate directory or verify they are an admin of the Slack workspace.
* Update the EC2 restart logic to verify the EC2 instance is a member of an auto scaling group before restarting.
