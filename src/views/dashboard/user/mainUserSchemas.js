import * as Yup from "yup";

export const requestApplicationAdminSchema = Yup.object().shape({
    /*id: Yup.string()
        .required('ID invalid'),
    username: Yup.string()
        .required('Username invalid'),
    appname: Yup.string()
        .required('Application name invalid'),*/
});

export const createAppSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    name: Yup.string()
        .required('Name invalid'),
    id_file: Yup.string()
        .required('File invalid'),
    id_template: Yup.string()
        .required('ID Template invalid'),
    os_type: Yup.string()
        .required('OS Type invalid'),
    installer: Yup.string()
        .required('Installer invalid'),
    installer_args: Yup.string()
        .required('Installer ARGS invalid'),
    installer_type: Yup.string()
        .required('Installer Type invalid'),
    target: Yup.string()
        .required('Target invalid'),
    target_args: Yup.string()
        .required('Target ARGS invalid'),
    version: Yup.string()
        .required('Version invalid'),
});

export const updateAppSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    name: Yup.string()
        .required('Name invalid'),
    id_file: Yup.string()
        .required('File invalid'),
    id_template: Yup.string()
        .required('ID Template invalid'),
    os_type: Yup.string()
        .required('OS Type invalid'),
    installer: Yup.string()
        .required('Installer invalid'),
    installer_args: Yup.string()
        .required('Installer ARGS invalid'),
    installer_type: Yup.string()
        .required('Installer Type invalid'),
    target: Yup.string()
        .required('Target invalid'),
    target_args: Yup.string()
        .required('Target ARGS invalid'),
    version: Yup.string()
        .required('Version invalid'),
});

export const createFileSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    filename: Yup.string()
        .required('Name invalid'),
    filepath: Yup.string()
        .required('Path invalid'),
    os_type: Yup.string()
        .required('OS Type invalid'),
    version: Yup.string()
        .required('Version invalid'),
    file: Yup.string()
        .required('File invalid'),
});

export const updateFileSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    filename: Yup.string()
        .required('Name invalid'),
    filepath: Yup.string()
        .required('Path invalid'),
    os_type: Yup.string()
        .required('OS Type invalid'),
    version: Yup.string()
        .required('Version invalid'),
    file: Yup.string()
        .required('File invalid'),
});

export const phasesBaseimageCreateContainerSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    obj_type: Yup.string()
        .required('Object type invalid'),
    name: Yup.string()
        .required('Name invalid'),
    rootimage: Yup.string()
        .required('Root image invalid'),
    cores: Yup.string()
        .required('Cores invalid'),
    memsize: Yup.string()
        .required('Memory size invalid'),
    disksize: Yup.string()
        .required('Disk size invalid'),
    dockerfile: Yup.mixed()
        .required('Dockerfile invalid'),
    ceph_public: Yup.string()
        .required('CEPH public invalid'),
    ceph_shared: Yup.string()
        .required('CEPH shared invalid'),
    ceph_user: Yup.string()
        .required('CEPH user invalid'),
    viewer_resolution: Yup.string()
        .required('Resolution invalid'),
    viewer_contype: Yup.string()
        .required('Contype invalid'),
    viewer_resize: Yup.string()
        .required('Resize invalid'),
    viewer_scale: Yup.string()
        .required('Scale invalid'),
});

export const phasesBaseimageCreateVMSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    obj_type: Yup.string()
        .required('Object type invalid'),
    name: Yup.string()
        .required('Name invalid'),
    os_type: Yup.string()
        .required('OS type invalid'),
    cores: Yup.string()
        .required('Cores invalid'),
    memsize: Yup.string()
        .required('Memory size invalid'),
    disksize: Yup.string()
        .required('Disk size invalid'),
    kb: Yup.string()
        .required('Keyboard language invalid'),
    ceph_pool: Yup.string()
        .required('CEPH pool invalid'),
});

export const phasesBaseimageCloneSchema = Yup.object().shape({
    id: Yup.string()
        .required('ID invalid'),
    newid: Yup.string()
        .required('New ID invalid'),
    name: Yup.string()
        .required('Name invalid'),
});

export const vmDataSchema = {
    id: "",
    obj_type: "",
    name: "",
    os_type: "",
    cores: "",
    memsize: "",
    disksize: "",
    kb: "",
    ceph_pool: "",
    ceph_public: "",
    ceph_shared: "",
    ceph_user: "",
    viewer_contype: "",
    viewer_resolution: "",
    viewer_resize: "",
    viewer_scale: "",
}

export const containerDataSchema = {
    id: "",
    obj_type: "",
    name: "",
    rootimage: "",
    cores: "",
    memsize: "",
    disksize: "",
    dockerfile: "",
    ceph_public: "",
    ceph_shared: "",
    ceph_user: "",
    viewer_contype: "",
    viewer_resolution: "",
    viewer_resize: "",
    viewer_scale: "",
}
