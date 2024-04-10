import type { Uni as _Uni } from '@dcloudio/types';
 
declare global {
	/**
	*拓展全局变量Uni
	*/
	interface Uni extends _Uni {
		$u: {
			os(): string;
			guid(): string;
			platform: string;
			toast(message: string): void;
		};
	}
}