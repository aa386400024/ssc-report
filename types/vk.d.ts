import type { Uni as _Uni } from '@dcloudio/types';

declare global {
	/**
	* 拓展全局变量Uni
	*/
	interface Uni extends _Uni {
		vk : {
			// 添加泛型参数
			callFunction<TReq, TRes>(options : {
				url : string;
				title ?: string;
				data : TReq;
				loading ?: boolean | object;
				success : (data : TRes) => void;
				fail(error : any) : void;
			}) : void;


		};
	}
	var vk : {
		navigateTo(url : string) : void;
		navigateBack(options ?: { delta ?: number }) : void;
		navigateToHome() : void;
		toast(title : string, icon ?: string) : void;

		navigate : {
			getOriginalPage() : any; // 添加这一行
			originalTo() : void;
			// 可能还有其他的navigate相关方法
		};
		pubfn : {
			timeFormat(date : Date | string | number, format : string) : string;
			test(value : string, type : string) : boolean;
			// ...如果pubfn还有其他方法或属性，也可以在这里添加
		};
		userCenter : {
			login(options : {
				data : any,
				loading ?: boolean | object,
				success : (data : any) => void,
				fail ?: (error : any) => void
			}) : void;
			loginByWeixinPhoneNumber(options : {
				data : any,
				loading ?: boolean | object,
				success : (data : any) => void,
				fail ?: (error : any) => void
			}) : void;
			code2SessionWeixin(options : {
				data : any,
				loading ?: boolean | object,
				success : (data : any) => void,
				fail ?: (error : any) => void
			}) : void;
			// 可能还有其他userCenter相关的方法
		}
		// ...其他方法和属性
	};
}