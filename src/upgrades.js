// Upgrade scripts migrate existing user configurations between module versions.
// They run in order when a user updates the module. Leave the array empty until
// you make a breaking change to config/actions/feedbacks, then append a script.
//
// Example: rename a config field, or migrate an action's options.
//
// const example_v1_1_0 = (context, props) => {
// 	const result = { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
// 	if (props.config && props.config.oldField !== undefined) {
// 		props.config.newField = props.config.oldField
// 		delete props.config.oldField
// 		result.updatedConfig = props.config
// 	}
// 	return result
// }

export const upgradeScripts = [
	// example_v1_1_0,
]
