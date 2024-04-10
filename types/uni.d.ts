import type { Uni as _Uni } from '@dcloudio/types';

declare global {
	/**
	* 扩展全局变量 Uni
	*/
	interface Uni extends _Uni {
		requirePrivacyAuthorize(options : {
			success ?: () => void;
			fail ?: () => void;
			complete ?: (complete : any) => void;
		}) : void;
	}
}