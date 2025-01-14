package com.esportzoo.esport.connect.request;


public class CmsContentRequest extends BaseRequest {


	private  Integer pageNo;

	private Integer pageSize;
	/** 资讯类型 */
	private Integer  contentType;

	/** 视频类型 */
	private Integer videoTypeIndex;

	public Integer getPageNo() {
		return pageNo;
	}

	public void setPageNo(Integer pageNo) {
		this.pageNo = pageNo;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getContentType() {
		return contentType;
	}

	public void setContentType(Integer contentType) {
		this.contentType = contentType;
	}

	public Integer getVideoTypeIndex() {
		return videoTypeIndex;
	}

	public void setVideoTypeIndex(Integer videoTypeIndex) {
		this.videoTypeIndex = videoTypeIndex;
	}
}
