let menuShow_export = true;

export default function menuShow_fun(menuCheck) {
	if (menuCheck === "true") {
		menuShow = true;
		menuShow_export = true;
	} else if (menuCheck === "false") {
		menuShow = false;
		menuShow_export = false;
	} else {
		if (menuShow_export) {
			return true;
		} else {
			return false;
		}
	}
}
